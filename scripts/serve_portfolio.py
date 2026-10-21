#!/usr/bin/env python3
"""Safely preview the static portfolio and browser-only /spare-ad/ application."""
import argparse
from pathlib import Path
import sys
from wsgiref.simple_server import make_server

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from services.spare_ad.server import application

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    with make_server(args.host, args.port, application) as server:
        print(f"Portfolio: http://{args.host}:{args.port}/", flush=True)
        print(f"Fair SPARE-AD: http://{args.host}:{args.port}/spare-ad/", flush=True)
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            pass
