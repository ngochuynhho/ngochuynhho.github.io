#!/usr/bin/env python3
"""Little Days static server and encrypted snapshot sync API."""

from __future__ import annotations

import hashlib
import hmac
import json
import mimetypes
import os
import re
import sqlite3
import sys
from datetime import datetime, timezone
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit

APP_ROOT = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("LITTLE_DAYS_DATA_DIR", APP_ROOT / "data")).resolve()
DB_PATH = DATA_DIR / "little-days.sqlite3"
MAX_BODY_BYTES = 8 * 1024 * 1024
SPACE_PATTERN = re.compile(r"^[A-Za-z0-9_-]{12,32}$")
STATIC_DIRECTORIES = {"feedingGuidance", "growth", "icons"}
STATIC_TOP_LEVEL = {
    "app.js",
    "family.js",
    "feeding-guidance.css",
    "index.html",
    "manifest.webmanifest",
    "styles.css",
    "sw.js",
    "sync.js",
    "temperature.css",
}


class ConflictError(Exception):
    def __init__(self, version: int):
        self.version = version


class NotFoundError(Exception):
    pass


class SyncStore:
    def __init__(self, path: Path = DB_PATH):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)
        try:
            self.path.parent.chmod(0o700)
        except OSError:
            pass
        with self._connect() as connection:
            connection.execute("PRAGMA journal_mode=WAL")
            connection.execute(
                """
                CREATE TABLE IF NOT EXISTS sync_spaces (
                    space_id TEXT PRIMARY KEY,
                    token_hash BLOB NOT NULL,
                    version INTEGER NOT NULL,
                    payload TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
                """
            )

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.path, timeout=10)
        connection.row_factory = sqlite3.Row
        return connection

    @staticmethod
    def _token_hash(token: str) -> bytes:
        return hashlib.sha256(token.encode("utf-8")).digest()

    def get(self, space_id: str, token: str) -> dict:
        with self._connect() as connection:
            row = connection.execute(
                "SELECT token_hash, version, payload FROM sync_spaces WHERE space_id = ?",
                (space_id,),
            ).fetchone()
        if row is None or not hmac.compare_digest(row["token_hash"], self._token_hash(token)):
            raise NotFoundError
        payload = json.loads(row["payload"])
        return {"version": row["version"], **payload}

    def put(self, space_id: str, token: str, expected_version: int, payload: dict) -> int:
        now = datetime.now(timezone.utc).isoformat()
        encoded = json.dumps(payload, separators=(",", ":"))
        with self._connect() as connection:
            connection.execute("BEGIN IMMEDIATE")
            row = connection.execute(
                "SELECT token_hash, version FROM sync_spaces WHERE space_id = ?",
                (space_id,),
            ).fetchone()
            if row is None:
                if expected_version != 0:
                    raise ConflictError(0)
                connection.execute(
                    "INSERT INTO sync_spaces VALUES (?, ?, 1, ?, ?, ?)",
                    (space_id, self._token_hash(token), encoded, now, now),
                )
                return 1
            if not hmac.compare_digest(row["token_hash"], self._token_hash(token)):
                raise NotFoundError
            if expected_version != row["version"]:
                raise ConflictError(row["version"])
            version = row["version"] + 1
            connection.execute(
                "UPDATE sync_spaces SET version = ?, payload = ?, updated_at = ? WHERE space_id = ?",
                (version, encoded, now, space_id),
            )
            return version


def validate_payload(value: object) -> dict:
    if not isinstance(value, dict) or set(value) != {"iv", "ciphertext"}:
        raise ValueError("Expected an encrypted sync payload.")
    iv, ciphertext = value.get("iv"), value.get("ciphertext")
    if not isinstance(iv, str) or not re.fullmatch(r"[A-Za-z0-9_-]{16}", iv):
        raise ValueError("Invalid encryption nonce.")
    if not isinstance(ciphertext, str) or not re.fullmatch(r"[A-Za-z0-9_-]+", ciphertext):
        raise ValueError("Invalid encrypted payload.")
    return {"iv": iv, "ciphertext": ciphertext}


class LittleDaysHandler(BaseHTTPRequestHandler):
    store: SyncStore
    server_version = "LittleDays/1.0"

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "no-referrer")
        self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
        self.send_header("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'")
        super().end_headers()

    def do_GET(self) -> None:
        path = urlsplit(self.path).path
        if path == "/api/health":
            self.send_json(HTTPStatus.OK, {"status": "ok"})
            return
        match = re.fullmatch(r"/api/sync/([A-Za-z0-9_-]+)", path)
        if match:
            self.get_sync(match.group(1))
            return
        if path.startswith("/api/"):
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found."})
            return
        self.send_static(path)

    def do_PUT(self) -> None:
        match = re.fullmatch(r"/api/sync/([A-Za-z0-9_-]+)", urlsplit(self.path).path)
        if not match:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Not found."})
            return
        self.put_sync(match.group(1))

    def get_sync(self, space_id: str) -> None:
        token = self.bearer_token()
        if not SPACE_PATTERN.fullmatch(space_id) or token is None:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Sync space not found."})
            return
        try:
            result = self.store.get(space_id, token)
        except NotFoundError:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Sync space not found."})
            return
        self.send_json(HTTPStatus.OK, result, no_store=True)

    def put_sync(self, space_id: str) -> None:
        token = self.bearer_token()
        if not SPACE_PATTERN.fullmatch(space_id) or token is None:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Sync space not found."})
            return
        try:
            expected_version = int(self.headers.get("If-Match", ""))
        except ValueError:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": "If-Match must contain the expected numeric version."})
            return
        try:
            body = self.read_json()
            payload = validate_payload(body)
            version = self.store.put(space_id, token, expected_version, payload)
        except ValueError as error:
            self.send_json(HTTPStatus.BAD_REQUEST, {"error": str(error)})
            return
        except ConflictError as error:
            self.send_json(HTTPStatus.CONFLICT, {"error": "Version conflict.", "version": error.version}, no_store=True)
            return
        except NotFoundError:
            self.send_json(HTTPStatus.NOT_FOUND, {"error": "Sync space not found."})
            return
        self.send_json(HTTPStatus.CREATED if version == 1 else HTTPStatus.OK, {"version": version}, no_store=True)

    def bearer_token(self) -> str | None:
        header = self.headers.get("Authorization", "")
        if not header.startswith("Bearer "):
            return None
        token = header[7:]
        if not re.fullmatch(r"[A-Za-z0-9_-]{40,64}", token):
            return None
        return token

    def read_json(self) -> object:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError as error:
            raise ValueError("Invalid Content-Length.") from error
        if length <= 0 or length > MAX_BODY_BYTES:
            raise ValueError("Encrypted snapshot is empty or too large.")
        try:
            return json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError) as error:
            raise ValueError("Request body must be valid JSON.") from error

    def send_static(self, request_path: str) -> None:
        relative = unquote(request_path).lstrip("/") or "index.html"
        parts = Path(relative).parts
        allowed = relative in STATIC_TOP_LEVEL or (parts and parts[0] in STATIC_DIRECTORIES)
        target = (APP_ROOT / relative).resolve()
        if not allowed or APP_ROOT not in target.parents or not target.is_file():
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        content_type = mimetypes.guess_type(target.name)[0] or "application/octet-stream"
        body = target.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", f"{content_type}; charset=utf-8" if content_type.startswith("text/") or content_type in {"application/javascript", "application/manifest+json"} else content_type)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-cache" if target.name in {"index.html", "sw.js"} else "public, max-age=3600")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def do_HEAD(self) -> None:
        path = urlsplit(self.path).path
        if path.startswith("/api/"):
            self.send_json(HTTPStatus.METHOD_NOT_ALLOWED, {"error": "Method not allowed."})
            return
        self.send_static(path)

    def send_json(self, status: HTTPStatus, value: dict, no_store: bool = False) -> None:
        body = json.dumps(value, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        if no_store:
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)


def main() -> None:
    host = os.environ.get("LITTLE_DAYS_HOST", "127.0.0.1")
    try:
        port = int(os.environ.get("LITTLE_DAYS_PORT", "8766"))
    except ValueError:
        sys.exit("LITTLE_DAYS_PORT must be a number.")
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    LittleDaysHandler.store = SyncStore(DB_PATH)
    server = ThreadingHTTPServer((host, port), LittleDaysHandler)
    print(f"Little Days available at http://{host}:{port}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
