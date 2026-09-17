#!/usr/bin/env python3
"""Refresh public Scholar data without exposing the API key to the website."""
from __future__ import annotations

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import re
import shutil
import sys
import tempfile
import unicodedata
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import urlopen


def normalize(value: str) -> str:
    value = unicodedata.normalize("NFKD", str(value or ""))
    value = "".join(c for c in value if not unicodedata.combining(c)).lower()
    value = value.replace("&", " and ")
    value = re.sub(r"['’‘]", "", value)
    return re.sub(r"[^a-z0-9]+", " ", value).strip()


def identity_keys(paper: dict) -> set[str]:
    result = set()
    if paper.get("scholar_id"):
        result.add(f"scholar:{paper['scholar_id']}")
    if paper.get("doi"):
        doi = re.sub(r"^https?://doi.org/", "", paper["doi"].lower()).rstrip(".")
        result.add(f"doi:{doi}")
    for field in ["title", "scholar_title"]:
        if paper.get(field):
            result.add(f"title:{normalize(paper[field])}")
    return result


def find_pending(articles: list[dict], catalog: dict) -> list[dict]:
    known = set(catalog.get("ignored", []))
    for paper in catalog["publications"]:
        known.update(identity_keys(paper))
    pending = []
    for paper in articles:
        identities = identity_keys(paper)
        if not identities & known:
            pending.append(paper)
            known.update(identities)
    return pending


def guess_topic(title: str) -> str:
    text = normalize(title)
    if any(word in text for word in ["brain aging", "brain ageing", "blood pressure", "small vessel", "connectome", "pathology"]):
        return "brain-health"
    if any(word in text for word in ["alzheimer", "dementia", "mci", "progression free"]):
        return "dementia"
    if any(word in text for word in ["emotion", "affective", "stress", "cohesion", "reaction", "expression"]):
        return "affective-ai"
    if any(word in text for word in ["tumor", "tumour", "tissue segmentation", "sepsis"]):
        return "medical-imaging"
    if any(word in text for word in ["smartphone", "walking", "step length", "gesture", "mouse", "relay", "radio"]):
        return "sensing-interaction"
    return "other"


def guess_type(venue: str) -> str:
    text = normalize(venue)
    if any(word in text for word in ["conference", "proceedings", "workshop", "suppl"]):
        return "conference"
    if any(word in text for word in ["arxiv", "preprint", "biorxiv", "medrxiv"]):
        return "other"
    if any(word in text for word in ["journal", "ieee access", "scientific reports", "nature communications", "applied sciences", "neural networks", "sensors", "eclinicalmedicine", "soft computing", "brain research bulletin", "multimedia tools"]):
        return "journal"
    return "other"


def nonnegative_int(value) -> int | None:
    if isinstance(value, bool):
        return None
    try:
        number = int(str(value).replace(",", ""))
        return number if number >= 0 else None
    except (ValueError, TypeError):
        return None


def parse_metrics(page: dict) -> dict:
    table = page.get("cited_by", {}).get("table", [])
    metrics = {"citations": None, "h_index": None, "i10_index": None}
    aliases = {"citations": "citations", "h_index": "h_index", "i10_index": "i10_index",
               "indice_h": "h_index", "indice_i10": "i10_index"}
    for row in table:
        for key, values in row.items():
            if key in aliases and isinstance(values, dict):
                metrics[aliases[key]] = nonnegative_int(values.get("all"))
    if any(value is None for value in metrics.values()):
        raise ValueError("Scholar returned incomplete citation metrics. The previous snapshot has been kept.")
    return metrics


def parse_article(article: dict) -> dict:
    title = str(article.get("title", "")).strip()
    if not title:
        raise ValueError("Scholar returned an article without a title. The previous snapshot has been kept.")
    venue = str(article.get("publication", "")).strip()
    return {"title": title, "authors": str(article.get("authors", "")), "venue": venue,
            "year": nonnegative_int(article.get("year")), "url": str(article.get("link", "")),
            "doi": "", "scholar_id": str(article.get("citation_id", "")),
            "citations": nonnegative_int(article.get("cited_by", {}).get("value")),
            "type": guess_type(venue), "topic": guess_topic(title)}


def fetch_page(api_key: str, author_id: str, start: int) -> dict:
    params = {"engine": "google_scholar_author", "author_id": author_id, "hl": "en",
              "sort": "pubdate", "num": 100, "start": start, "api_key": api_key}
    try:
        with urlopen("https://serpapi.com/search.json?" + urlencode(params), timeout=45) as response:
            return json.load(response)
    except HTTPError as error:
        # Do not stringify urllib exceptions: their URLs contain the API key.
        raise RuntimeError(f"Scholar API request failed (HTTP {error.code}). Check API quota and the Actions secret.") from None
    except (URLError, TimeoutError, json.JSONDecodeError):
        raise RuntimeError("Scholar API could not be reached or returned invalid JSON. Retry later.") from None


def collect_snapshot(fetch, author_id: str, catalog: dict, previous: dict) -> dict:
    articles = []
    seen = set()
    start = 0
    metrics = None
    for _ in range(20):
        page = fetch(start)
        if not isinstance(page, dict) or page.get("error"):
            # The third-party error text can include request credentials; omit it.
            raise ValueError("Scholar API reported an error. Check the API key and quota; existing data has been kept.")
        if metrics is None:
            if not page.get("author", {}).get("name"):
                raise ValueError("Scholar returned no author profile. Existing data has been kept.")
            metrics = parse_metrics(page)
        raw = page.get("articles")
        if not isinstance(raw, list):
            raise ValueError("Scholar returned an incomplete publication list. Existing data has been kept.")
        if not raw:
            if not articles:
                raise ValueError("Scholar returned no publications. Existing data has been kept.")
            break
        added = 0
        for item in raw:
            parsed = parse_article(item)
            identity = parsed["scholar_id"] or normalize(parsed["title"])
            if identity not in seen:
                articles.append(parsed)
                seen.add(identity)
                added += 1
        if not added:
            raise ValueError("Scholar pagination repeated a page. Existing data has been kept.")
        has_next = bool(page.get("serpapi_pagination", {}).get("next"))
        if len(raw) < 100 and not has_next:
            break
        start += len(raw)
    else:
        raise ValueError("Scholar pagination exceeded the scan limit. Existing data has been kept.")
    return {"schema_version": 1, "author_id": author_id,
            "profile_url": f"https://scholar.google.com/citations?user={author_id}&hl=en",
            "updated_at": datetime.now(timezone.utc).isoformat(), **metrics,
            "previously_recorded_citations": previous.get("previously_recorded_citations"),
            "articles": articles, "pending": find_pending(articles, catalog), "status": "ok"}


def save_snapshot(data_dir: Path, snapshot: dict, backup_dir: Path) -> None:
    backup = backup_dir / datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%S%fZ")
    backup.mkdir(parents=True)
    for path in data_dir.glob("*.json"):
        shutil.copy2(path, backup / path.name)
    payload = json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n"
    # Only replace the public snapshot after all pages and metrics are validated.
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=data_dir, suffix=".tmp", delete=False) as temp:
        temp.write(payload)
        temp_name = temp.name
    try:
        os.replace(temp_name, data_dir / "scholar.json")
    finally:
        Path(temp_name).unlink(missing_ok=True)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--data-dir", type=Path, default=Path("data"))
    parser.add_argument("--backup-dir", type=Path, default=Path(".backups/scholar"))
    args = parser.parse_args()
    api_key = os.environ.get("SERPAPI_KEY", "")
    if not api_key:
        print("Set SERPAPI_KEY as a GitHub Actions secret. No website data was changed.", file=sys.stderr)
        return 1
    try:
        config = json.loads((args.data_dir / "site-config.json").read_text())
        catalog = json.loads((args.data_dir / "publications.json").read_text())
        previous = json.loads((args.data_dir / "scholar.json").read_text())
        author_id = config["scholar_author_id"]
        if previous["author_id"] != author_id:
            raise ValueError("The Scholar author IDs in the configuration and snapshot do not match.")
        snapshot = collect_snapshot(lambda start: fetch_page(api_key, author_id, start), author_id, catalog, previous)
        save_snapshot(args.data_dir, snapshot, args.backup_dir)
        print(f"Scholar refreshed: {snapshot['citations']} citations, {len(snapshot['pending'])} new publications to review.")
        return 0
    except (ValueError, KeyError, TypeError, AttributeError, OSError, RuntimeError):
        # All diagnostics remain independent of API key values and fetched payloads.
        print("Scholar sync failed. Check the API secret, quota, profile ID, and data format. Previous website data was kept.", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
