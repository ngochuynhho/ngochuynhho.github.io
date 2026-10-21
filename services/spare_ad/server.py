"""Serve the portfolio and the portable SPARE-AD app through one origin."""
import importlib
import json
import mimetypes
import os
from pathlib import Path
import sys
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[2]
PUBLIC_DIRECTORIES = {"assets", "data", "cv", "blog", "talks", "spare-ad"}
PUBLIC_FILES = {"index.html", "admin.html", "robots.txt", "sitemap.xml"}


class PortfolioApplication:
    def __init__(self, root=ROOT, bundle=None):
        self.root = Path(root).resolve()
        self.bundle = Path(bundle or os.environ.get("SPARE_AD_BUNDLE", self.root / ".spare-ad-runtime/bundle")).resolve()
        self.backend = None

    def load_backend(self):
        if self.backend is None:
            origin = os.environ.get("APP_PUBLIC_ORIGIN", "")
            if origin:
                parsed = urlsplit(origin)
                if parsed.scheme not in {"https", "http"} or not parsed.netloc or parsed.path or parsed.query or parsed.fragment or parsed.username:
                    raise ValueError("APP_PUBLIC_ORIGIN must be the exact website origin, without a path.")
            os.environ["APP_BASE_PATH"] = "/spare-ad"
            sys.path.insert(0, str(self.bundle))
            adapter = importlib.import_module("app.wsgi")
            if Path(adapter.__file__).resolve() != self.bundle / "app/wsgi.py":
                raise RuntimeError("Another Python package is using the portable app namespace.")
            self.backend = adapter.application
        return self.backend

    def __call__(self, environ, start_response):
        path = unquote(environ.get("PATH_INFO", "/"))
        if "\x00" in path:
            return self.not_found(start_response)
        if path == "/spare-ad":
            start_response("308 Permanent Redirect", [("Location", "/spare-ad/"), ("Content-Length", "0")])
            return [b""]
        if path.startswith("/spare-ad/") and (self.bundle / "portfolio-integration.json").is_file():
            return self.load_backend()(environ, start_response)
        if path.startswith("/spare-ad/api/") or path == "/spare-ad/healthz":
            body = json.dumps({"error": "The Python research service has not been connected at this address."}).encode()
            start_response("503 Service Unavailable", [("Content-Type", "application/json"), ("Content-Length", str(len(body))), ("Cache-Control", "no-store")])
            return [body]
        relative = path.lstrip("/")
        parts = Path(relative).parts
        if any(part.startswith(".") for part in parts) or "\\" in relative or not (relative in PUBLIC_FILES or not relative or (parts and parts[0] in PUBLIC_DIRECTORIES)):
            return self.not_found(start_response)
        target = (self.root / (relative or "index.html")).resolve()
        if not self.public_target(target):
            return self.not_found(start_response)
        if target.is_dir():
            if not path.endswith("/"):
                start_response("308 Permanent Redirect", [("Location", path + "/"), ("Content-Length", "0")])
                return [b""]
            target = (target / "index.html").resolve()
        if not self.public_target(target) or not target.is_file():
            return self.not_found(start_response)
        if environ.get("REQUEST_METHOD", "GET") not in {"GET", "HEAD"}:
            start_response("405 Method Not Allowed", [("Allow", "GET, HEAD"), ("Content-Length", "0")])
            return [b""]
        kind = mimetypes.guess_type(target)[0] or "application/octet-stream"
        start_response("200 OK", [("Content-Type", kind), ("Content-Length", str(target.stat().st_size)), ("X-Content-Type-Options", "nosniff")])
        return [] if environ.get("REQUEST_METHOD") == "HEAD" else [target.read_bytes()]

    def public_target(self, target):
        if not target.is_relative_to(self.root):
            return False
        relative = target.relative_to(self.root)
        parts = relative.parts
        if any(part.startswith(".") or part == "private" for part in parts):
            return False
        return relative.as_posix() in PUBLIC_FILES or bool(parts and parts[0] in PUBLIC_DIRECTORIES)

    @staticmethod
    def not_found(start_response):
        start_response("404 Not Found", [("Content-Type", "text/plain"), ("Content-Length", "9")])
        return [b"Not found"]


application = PortfolioApplication()
