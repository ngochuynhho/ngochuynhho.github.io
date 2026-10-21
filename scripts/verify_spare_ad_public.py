#!/usr/bin/env python3
"""Audit the browser app's publishable assets without needing Python ML packages."""
import argparse
from collections import Counter
import gzip
import hashlib
import json
import math
from pathlib import Path
import re
import struct

ROOT = Path(__file__).resolve().parents[1]
ROW_FIELDS = {"age", "diagnosis", "ethnicity", "p", "index", "logit", "age_z", "prediction"}
NORM_FIELDS = {"intercept", "slope", "sd", "n", "age_min", "age_max"}
FIT_FIELDS = {"coefficients", "center", "scale", "age_min", "age_max", "n", "degree"}
CORE = {"app.js", "browser-api.mjs", "compression.mjs", "csv.mjs", "engine.mjs", "worker.mjs"}
ALLOWED = CORE | {"index.html", "style.css", "plotly.min.js", "PLOTLY-LICENSE", "plotly.min.js.LICENSE.txt",
                  "data/config.json", "data/input_template.csv", "data/privacy.json",
                  "data/best.reference.json.gz", "data/average.reference.json.gz",
                  "models/best.bin.gz", "models/average.bin.gz", "models/manifest.json"}


def audit(site):
    files = {path.relative_to(site).as_posix() for path in site.rglob("*") if path.is_file()}
    required = ALLOWED - {"plotly.min.js.LICENSE.txt"}
    if not required <= files or files - ALLOWED:
        raise ValueError("Public app has missing or unexpected files: " + ", ".join(sorted((required - files) | (files - ALLOWED))))
    for path in site.rglob("*"):
        if path.is_symlink():
            raise ValueError("Public app files must not be symlinks.")
    for name in CORE:
        source = "app.mjs" if name == "app.js" else name
        if (site / name).read_bytes() != (ROOT / "services/spare_ad/browser" / source).read_bytes():
            raise ValueError("Public browser source needs rebuilding: " + name)
    config = json.loads((site / "data/config.json").read_text())
    if len(config["features"]) != 145 or config["features"][0] != "ICV" or [m["id"] for m in config["models"]] != ["best", "average"]:
        raise ValueError("Unexpected public model configuration.")
    privacy = json.loads((site / "data/privacy.json").read_text())
    if any(privacy.get(field) != "removed" for field in ("subject_identifiers", "cohort_information", "source_partition_labels")):
        raise ValueError("The public reference privacy policy is missing.")
    manifest = json.loads((site / "models/manifest.json").read_text())
    source_checked = False
    for name, members in [("best", 1), ("average", 100)]:
        payload = gzip.decompress((site / f"models/{name}.bin.gz").read_bytes())
        magic, count, features, trees, nodes, _, _ = struct.unpack_from("<8s6I", payload)
        if magic != b"SPAD0001" or count != members or features != 145 or not trees or not nodes:
            raise ValueError("Invalid browser tree model: " + name)
        if len(payload) != 32 + 4 * (2 * count + 1 + trees + 4 * nodes) or hashlib.sha256(payload).hexdigest() != manifest[name]["sha256"]:
            raise ValueError("Browser model checksum failed: " + name)
        data = json.loads(gzip.decompress((site / f"data/{name}.reference.json.gz").read_bytes()))
        if set(data) != {"rows", "norm", "trends", "trend_lines", "warnings", "model", "model_count", "feature_count", "mci_count", "threshold"} or data["warnings"]:
            raise ValueError("Reference data contains unexpected metadata.")
        if len(data["rows"]) != 14597 or Counter(row["diagnosis"] for row in data["rows"]) != {"CN": 6223, "MCI": 5590, "DA": 2784}:
            raise ValueError("Unexpected public reference counts.")
        if data["model_count"] != members or data["threshold"] != (0.06 if name == "best" else 0.5):
            raise ValueError("Unexpected public inference settings.")
        for row in data["rows"]:
            if set(row) != ROW_FIELDS or not isinstance(row["ethnicity"], str):
                raise ValueError("A reference row contains unexpected identifying fields.")
            if any(not isinstance(row[field], (int, float)) or not math.isfinite(row[field]) for field in ("age", "p", "index", "logit", "age_z")):
                raise ValueError("Invalid reference numeric data.")
        if set(data["norm"]) != NORM_FIELDS:
            raise ValueError("Reference normalization contains unexpected metadata.")
        for kinds in data["trends"].values():
            for fits in kinds.values():
                if set(fits) != {"CN", "MCI", "DA"} or any(set(fit) != FIT_FIELDS for fit in fits.values()):
                    raise ValueError("Reference trends contain unexpected metadata.")
        for kinds in data["trend_lines"].values():
            for lines in kinds.values():
                if any(set(line) != {"diagnosis", "x", "y"} for line in lines):
                    raise ValueError("Reference trend lines contain unexpected metadata.")
        source_path = ROOT / f".spare-ad-runtime/bundle/precomputed/{name}.reference.json"
        if source_path.exists():
            source = json.loads(source_path.read_text())
            key = lambda row: tuple(row[field] for field in sorted(ROW_FIELDS))
            if Counter(map(key, data["rows"])) != Counter(map(key, source["rows"])):
                raise ValueError("Reference values changed during de-identification.")
            if data["trends"] != source["trends"] or data["trend_lines"] != source["trend_lines"] or data["norm"] != {field: source["norm"][field] for field in NORM_FIELDS}:
                raise ValueError("Frozen curves or normalization changed.")
            ids = {row["id"] for row in source["rows"]}
            if any(value in ids for row in data["rows"] for value in row.values() if isinstance(value, str)):
                raise ValueError("A source reference identifier is still present.")
            cohorts = {row["cohort"] for row in source["rows"] if len(row["cohort"]) >= 3 and row["cohort"].lower() not in {"unknown", "other", "reference", "uploaded", "scan", "scans"}}
            texts = [json.dumps(data), (site / "index.html").read_text(), json.dumps(config)]
            if any(re.search(r"(?<!\w)" + re.escape(cohort) + r"(?!\w)", text, re.I) for cohort in cohorts for text in texts):
                raise ValueError("A source cohort label is still present in public reference content.")
            source_checked = True
    print("Public SPARE-AD audit passed: 100 ensemble members, two 14,597-row references, approved fields only, no IDs/cohort labels, matching model checksums.")
    if source_checked:
        print("Private-source comparison passed: all retained numeric values, frozen curves and normalization are unchanged.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--site-dir", type=Path, default=ROOT / "spare-ad")
    audit(parser.parse_args().site_dir.resolve())
