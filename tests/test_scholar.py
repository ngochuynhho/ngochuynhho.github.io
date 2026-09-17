import io
import json
from pathlib import Path
import sys
import tarfile
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import HTTPError

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import sync_scholar as scholar
import backup_site


def page(articles):
    return {"author": {"name": "Test author"}, "articles": articles,
            "cited_by": {"table": [{"citations": {"all": 1234}},
                                     {"h_index": {"all": 18}},
                                     {"i10_index": {"all": 22}}]}}


def article(index, title=None):
    return {"citation_id": f"author:{index}", "title": title or f"Research paper {index}",
            "authors": "NH Ho, A Researcher", "publication": "Scientific Reports 2026",
            "year": "2026", "link": "https://scholar.google.com/citations?view_op=view_citation",
            "cited_by": {"value": 4}}


class ScholarTests(unittest.TestCase):
    def test_duplicate_unicode_title_is_matched(self):
        existing = {"title": "Alzheimer’s disease: MRI & clinical data"}
        incoming = {"title": "Alzheimer's disease — MRI and clinical data"}
        self.assertEqual(scholar.find_pending([incoming], {"publications": [existing]}), [])

    def test_ignored_identity_matches_changed_title(self):
        incoming = {"title": "A corrected title", "scholar_id": "author:123"}
        self.assertEqual(scholar.find_pending([incoming], {"publications": [], "ignored": ["scholar:author:123"]}), [])

    def test_corrected_publication_remembers_scholar_title(self):
        existing = {"title": "Owner corrected title", "scholar_title": "Original title"}
        self.assertEqual(scholar.find_pending([{"title": "Original title"}], {"publications": [existing]}), [])

    def test_duplicate_rows_are_not_suggested_twice(self):
        incoming = {"title": "New journal paper"}
        self.assertEqual(len(scholar.find_pending([incoming, incoming], {"publications": []})), 1)

    def test_full_pagination_and_metrics(self):
        responses = {0: page([article(i) for i in range(100)]), 100: page([article(100)])}
        requests = []
        def fetch(start):
            requests.append(start)
            return responses[start]
        result = scholar.collect_snapshot(fetch, "author", {"publications": [{"title": "Research paper 0"}]}, {})
        self.assertEqual(requests, [0, 100])
        self.assertEqual(result["citations"], 1234)
        self.assertEqual(len(result["articles"]), 101)
        self.assertEqual(len(result["pending"]), 100)

    def test_zero_is_valid_but_missing_metrics_fail(self):
        response = page([article(1)])
        response["cited_by"]["table"][0]["citations"]["all"] = 0
        self.assertEqual(scholar.parse_metrics(response)["citations"], 0)
        response["cited_by"]["table"].pop()
        with self.assertRaises(ValueError):
            scholar.parse_metrics(response)

    def test_partial_or_repeated_scan_is_rejected(self):
        first = page([article(i) for i in range(100)])
        for subsequent in [{"error": "API quota exceeded"}, first, {"author": {"name": "Test"}}]:
            with self.subTest(subsequent=list(subsequent)):
                with self.assertRaises(ValueError):
                    scholar.collect_snapshot(lambda start: first if start == 0 else subsequent,
                                             "author", {"publications": []}, {})

    def test_topic_does_not_confuse_imaging_with_aging(self):
        self.assertEqual(scholar.guess_topic("Abnormal tissue segmentation in medical imaging"), "medical-imaging")
        self.assertEqual(scholar.guess_topic("Fair neuroimaging dementia classification"), "dementia")
        self.assertEqual(scholar.guess_topic("Brain aging biomarkers from connectomes"), "brain-health")

    def test_conference_supplements_are_not_journal_guesses(self):
        self.assertEqual(scholar.guess_type("Alzheimer’s & Dementia 21 Suppl 2"), "conference")
        self.assertEqual(scholar.guess_type("arXiv preprint"), "other")

    def test_http_error_does_not_expose_key(self):
        secret = "private-test-key"
        error = HTTPError(f"https://serpapi.com/search?api_key={secret}", 401, "Unauthorized", {}, None)
        with patch.object(scholar, "urlopen", side_effect=error):
            with self.assertRaises(RuntimeError) as captured:
                scholar.fetch_page(secret, "author", 0)
        self.assertNotIn(secret, str(captured.exception))

    def test_atomic_snapshot_and_prechange_backup(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            data = root / "data"
            data.mkdir()
            original = {"citations": 1089}
            (data / "scholar.json").write_text(json.dumps(original))
            (data / "publications.json").write_text('{"publications": []}')
            scholar.save_snapshot(data, {"citations": 1234}, root / "backups")
            self.assertEqual(json.loads((data / "scholar.json").read_text())["citations"], 1234)
            backups = list((root / "backups").glob("*/scholar.json"))
            self.assertEqual(len(backups), 1)
            self.assertEqual(json.loads(backups[0].read_text()), original)
            self.assertFalse(list(data.glob("*.tmp")))

    def test_missing_secret_does_not_mutate_data(self):
        with patch.dict("os.environ", {}, clear=True), patch("sys.argv", ["sync_scholar.py"]), patch("sys.stderr", io.StringIO()):
            self.assertEqual(scholar.main(), 1)

    def test_restore_takes_safety_backup(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "index.html").write_text("original")
            archive = backup_site.create_backup(root)
            (root / "index.html").write_text("redesign")
            saved = backup_site.restore_backup(root, archive)
            self.assertEqual((root / "index.html").read_text(), "original")
            with tarfile.open(saved) as safety:
                self.assertEqual(safety.extractfile("index.html").read(), b"redesign")

    def test_restore_rejects_traversal_without_mutation(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            (root / "index.html").write_text("keep this")
            bad = root / "bad.tar.gz"
            with tarfile.open(bad, "w:gz") as archive:
                member = tarfile.TarInfo("../index.html")
                member.size = 3
                archive.addfile(member, io.BytesIO(b"bad"))
            with self.assertRaises(ValueError):
                backup_site.restore_backup(root, bad)
            self.assertEqual((root / "index.html").read_text(), "keep this")

    def test_all_preserved_journals_have_a_theme(self):
        root = Path(__file__).resolve().parents[1]
        catalog = json.loads((root / "data/publications.json").read_text())
        topics = json.loads((root / "data/topics.json").read_text())
        theme_ids = {topic["id"] for topic in topics}
        self.assertGreaterEqual(len(catalog["publications"]), 48)
        for paper in catalog["publications"]:
            if paper["type"] == "journal":
                self.assertIn(paper["topic"], theme_ids)


if __name__ == "__main__":
    unittest.main()
