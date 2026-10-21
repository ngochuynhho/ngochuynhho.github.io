#!/usr/bin/env python3
"""Assemble the GitHub Pages app with subject identifiers and cohort data removed."""
import argparse
import gzip
import hmac
import json
from pathlib import Path
import re
import secrets
import shutil

ROOT = Path(__file__).resolve().parents[1]
BUNDLE = ROOT / ".spare-ad-runtime/bundle"
DEVELOPMENT = ROOT / ".spare-ad-runtime/browser-development"
OUTPUT = DEVELOPMENT / "site/spare-ad"
ROW_FIELDS = ("age", "diagnosis", "ethnicity", "p", "index", "logit", "age_z", "prediction")
NORM_FIELDS = ("intercept", "slope", "sd", "n", "age_min", "age_max")
FIT_FIELDS = ("coefficients", "center", "scale", "age_min", "age_max", "n", "degree")


def reference_data(source, model, key):
    # No reference identifier, cohort label or source-partition label survives.
    ordered = sorted(enumerate(source["rows"]), key=lambda item: hmac.digest(key, f"{model}:{item[0]}".encode(), "sha256"))
    rows = [{field: row[field] for field in ROW_FIELDS} for _, row in ordered]
    trends = {score: {kind: {group: {field: fit[field] for field in FIT_FIELDS}
                           for group, fit in fits.items()}
                      for kind, fits in kinds.items()}
              for score, kinds in source["trends"].items()}
    lines = {score: {kind: [{field: line[field] for field in ("diagnosis", "x", "y")} for line in values]
                     for kind, values in kinds.items()} for score, kinds in source["trend_lines"].items()}
    return {"rows": rows, "norm": {field: source["norm"][field] for field in NORM_FIELDS},
            "trends": trends, "trend_lines": lines, "warnings": [],
            **{field: source[field] for field in ("model", "model_count", "feature_count", "mci_count", "threshold")}}


def build(install=False):
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for directory in ("data", "models"):
        (OUTPUT / directory).mkdir(exist_ok=True)
    key_path = DEVELOPMENT / "reference-shuffle.key"
    if not key_path.exists():
        key_path.write_bytes(secrets.token_bytes(32))
        key_path.chmod(0o600)
    key = key_path.read_bytes()
    for name in ("config.json", "input_template.csv"):
        shutil.copyfile(BUNDLE / "precomputed" / name, OUTPUT / "data" / name)
    for model in ("best", "average"):
        source = json.loads((BUNDLE / f"precomputed/{model}.reference.json").read_text())
        sanitized = reference_data(source, model, key)
        serialized = json.dumps(sanitized, ensure_ascii=False, separators=(",", ":"), allow_nan=False).encode()
        (OUTPUT / f"data/{model}.reference.json.gz").write_bytes(gzip.compress(serialized, compresslevel=9, mtime=0))
    privacy = {"schema_version": 1, "subject_identifiers": "removed", "cohort_information": "removed",
               "source_partition_labels": "removed", "row_order": "independently_shuffled_per_model",
               "scores_normalization_and_trends": "unchanged", "original_identity_mapping": "not_included"}
    (OUTPUT / "data/privacy.json").write_text(json.dumps(privacy, indent=2) + "\n")
    # An explicit file allowlist excludes fixtures, identity keys and native artifacts.
    for name in ("best.bin.gz", "average.bin.gz", "manifest.json"):
        shutil.copyfile(DEVELOPMENT / "models" / name, OUTPUT / "models" / name)
    for name in ("app.mjs", "browser-api.mjs", "compression.mjs", "csv.mjs", "engine.mjs", "worker.mjs"):
        shutil.copyfile(ROOT / "services/spare_ad/browser" / name, OUTPUT / ("app.js" if name == "app.mjs" else name))
    shutil.copyfile(BUNDLE / "static/plotly.min.js", OUTPUT / "plotly.min.js")
    for name in ("PLOTLY-LICENSE", "plotly.min.js.LICENSE.txt"):
        shutil.copyfile(ROOT / "services/spare_ad/browser" / name, OUTPUT / name)
    shutil.copyfile(ROOT / "services/spare_ad/ui/style.css", OUTPUT / "style.css")
    html = (ROOT / "services/spare_ad/ui/index.html").read_text()
    html = html.replace('<script src="app.js" defer></script>', '<script type="module" src="app.js"></script>')
    html = html.replace('href="api/template.csv"', 'href="data/input_template.csv"')
    html = html.replace('CSV uploads are processed in server memory and are not saved.', 'Your CSV stays on this device. All scores are computed in your browser.')
    html = html.replace('Place new scans in the context of your reference cohorts.', 'Place new scans in the context of the reference patterns.')
    html = html.replace('Choose cohorts, diagnoses & data subsets', 'Choose diagnoses, ethnicity & age range')
    html = html.replace('<div id="error" role="alert" hidden>', '<p id="calculation-status" class="help" role="status" aria-live="polite" hidden></p><button id="cancel-calculation" class="secondary" type="button" hidden>Cancel calculation</button><div id="error" role="alert" hidden>')
    html = html.replace('<main id="workspace">', '<main id="workspace"><p class="help">Runs entirely in your browser · CSV files are never uploaded</p>')
    methods = (ROOT / "services/spare_ad/browser/methods.html").read_text().strip()
    html, matches = re.subn(r'<details class="methods panel">.*?</details>', lambda _: methods, html, flags=re.S)
    if matches != 1:
        raise ValueError("The methods block could not be replaced safely.")
    html = html.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="default-src \'self\'; script-src \'self\'; style-src \'self\' \'unsafe-inline\'; worker-src \'self\' blob:; img-src \'self\' data: blob:; connect-src \'self\'">', 1)
    (OUTPUT / "index.html").write_text(html)
    if install:
        public = ROOT / "spare-ad"
        public.mkdir(exist_ok=True)
        for path in OUTPUT.rglob("*"):
            if path.is_file():
                destination = public / path.relative_to(OUTPUT)
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(path, destination)
        for obsolete in ("launch.js", "launch.css", "service.json"):
            (public / obsolete).unlink(missing_ok=True)
        print(f"Installed browser-only app with de-identified references: {public}")
    else:
        print(f"Prepared browser-only app with de-identified references: {OUTPUT}")
    print("Subject identifiers, cohort/source-partition labels and original identity mappings are excluded.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--install", action="store_true", help="Copy the approved browser assets into the public spare-ad/ folder")
    build(install=parser.parse_args().install)
