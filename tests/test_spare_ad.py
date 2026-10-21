"""Integration tests against the prepared portable bundle; no original training data."""
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from services.spare_ad.server import PortfolioApplication


class SpareADIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.gateway = PortfolioApplication(legacy_backend=True)
        cls.bundle = cls.gateway.bundle
        if not (cls.bundle / "portfolio-integration.json").exists():
            raise unittest.SkipTest("Run scripts/prepare_spare_ad.py first.")

    def request(self, path, method="GET", value=None, origin=None, query=""):
        payload = json.dumps(value).encode() if value is not None else b""
        env = {"REQUEST_METHOD": method, "PATH_INFO": path, "QUERY_STRING": query,
               "HTTP_HOST": "localhost:8000", "wsgi.url_scheme": "http",
               "CONTENT_LENGTH": str(len(payload)), "wsgi.input": io.BytesIO(payload)}
        if origin:
            env["HTTP_ORIGIN"] = origin
        result = {}
        def start(status, headers):
            result.update(status=status, headers=dict(headers))
        result["body"] = b"".join(self.gateway(env, start))
        return result

    def test_a_reference_rendering_does_not_initialize_inference(self):
        self.gateway.load_backend()
        self.assertNotIn("app.service", sys.modules)
        with patch.object(sys.modules["app.wsgi"], "get_service", side_effect=AssertionError("Reference page must not initialize inference")):
            for path in ["/spare-ad/", "/spare-ad/app.js", "/spare-ad/plotly.min.js", "/spare-ad/api/config"]:
                self.assertTrue(self.request(path)["status"].startswith("200"))
            for model in ["best", "average"]:
                response = self.request("/spare-ad/api/reference", query=f"model={model}")
                data = json.loads(response["body"])
                self.assertEqual(len(data["rows"]), 14597)
                self.assertEqual({dx: sum(r["diagnosis"] == dx for r in data["rows"]) for dx in ["CN", "MCI", "DA"]}, {"CN": 6223, "MCI": 5590, "DA": 2784})
                self.assertEqual(data["model_count"], 1 if model == "best" else 100)
                self.assertEqual(data["threshold"], 0.06 if model == "best" else 0.5)
        self.assertNotIn("app.service", sys.modules)

    def test_browser_routes_cannot_read_private_resources(self):
        for path in ["/.spare-ad-runtime/bundle/private/model_manifest.json", "/private/model_manifest.json",
                     "/spare-ad/private/models/run_076/model.ubj", "/spare-ad/private/reference_identity_keys.json",
                     "/spare-ad/precomputed/best.reference.json", "/spare-ad/app/service.py",
                     "/services/spare_ad/server.py", "/.git/config", "/assets/../.spare-ad-runtime/bundle/private/model_manifest.json"]:
            self.assertTrue(self.request(path)["status"].startswith("404"), path)
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            (root / "assets").mkdir()
            (root / ".private").mkdir()
            (root / ".private/secret").write_text("keep private")
            (root / "assets/link").symlink_to(root / ".private/secret")
            (root / "assets/linked-index").mkdir()
            (root / "assets/linked-index/index.html").symlink_to(root / ".private/secret")
            result = {}
            for path in ["/assets/link", "/assets/linked-index/"]:
                body = b"".join(PortfolioApplication(root)({"PATH_INFO": path}, lambda status, headers: result.update(status=status)))
                self.assertTrue(result["status"].startswith("404"))
                self.assertNotIn(b"keep private", body)

    def test_https_origin_and_upload_validation(self):
        adapter = sys.modules["app.wsgi"]
        with patch.object(adapter, "PUBLIC_ORIGIN", "https://research.example.org"):
            body = {"model": "best", "csv": "AGE\n65\n"}
            self.assertTrue(self.request("/spare-ad/api/predict", "POST", body, "https://other.example")["status"].startswith("403"))
            invalid = self.request("/spare-ad/api/predict", "POST", body, "https://research.example.org")
            self.assertTrue(invalid["status"].startswith("400"))
            self.assertIn("Missing required model features", json.loads(invalid["body"])["error"])
            self.assertNotIn("Access-Control-Allow-Origin", invalid["headers"])

    def test_native_fixture_parity_through_integrated_api(self):
        import numpy as np
        csv = (self.bundle / "private/smoke_input.csv").read_text()
        for model in ["best", "average"]:
            response = self.request("/spare-ad/api/predict", "POST", {"model": model, "csv": csv}, "http://localhost:8000")
            self.assertTrue(response["status"].startswith("200"))
            actual = json.loads(response["body"])
            expected = json.loads((self.bundle / f"private/smoke_expected_{model}.json").read_text())
            self.assertEqual(len(actual["rows"]), len(expected["rows"]))
            for row, target in zip(actual["rows"], expected["rows"]):
                for key in ["p", "index", "logit", "age_z", "trend_distance_CN", "trend_distance_MCI", "trend_distance_DA"]:
                    np.testing.assert_allclose(row[key], target[key], rtol=1e-12, atol=1e-12)
                self.assertEqual(row["prediction"], target["prediction"])
            service = sys.modules["app.wsgi"].get_service()
            with patch.object(service, "probabilities", side_effect=AssertionError("Reclassification must not run inference")):
                classified = self.request("/spare-ad/api/classify", "POST", {"model": model, "rows": actual["rows"], "score": "age_z", "trend": "curve"})
            self.assertEqual([r["p"] for r in json.loads(classified["body"])["rows"]], [r["p"] for r in actual["rows"]])

    def test_static_browser_is_default_even_with_native_bundle(self):
        gateway = PortfolioApplication()
        result = {}
        response = b"".join(gateway({"PATH_INFO": "/spare-ad/"}, lambda status, headers: result.update(status=status)))
        self.assertTrue(result["status"].startswith("200"))
        self.assertIn(b"calculation-status", response)
        self.assertIsNone(gateway.backend)
        response = b"".join(gateway({"PATH_INFO": "/spare-ad/api/config"}, lambda status, headers: result.update(status=status)))
        self.assertTrue(result["status"].startswith("404"))
        self.assertIsNone(gateway.backend)


if __name__ == "__main__":
    unittest.main()
