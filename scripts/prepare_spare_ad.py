#!/usr/bin/env python3
"""Verify the supplied handoff and prepare an ignored, server-only runtime copy."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil
import tempfile

ROOT = Path(__file__).resolve().parents[1]


def prepare(source: Path) -> Path:
    source = source.resolve(strict=True)
    hashes = json.loads((source / "SHA256SUMS.json").read_text())
    for relative, expected in hashes.items():
        name = Path(relative)
        path = source / name
        if name.is_absolute() or ".." in name.parts or path.is_symlink() or not path.is_file() or not path.resolve().is_relative_to(source):
            raise ValueError(f"Unsafe or missing bundle file: {relative}")
        if hashlib.sha256(path.read_bytes()).hexdigest() != expected:
            raise ValueError(f"Bundle integrity failed: {relative}")
    models = json.loads((source / "private/model_manifest.json").read_text())
    if models["models"]["best"]["members"] != ["run_076"] or len(set(models["models"]["average"]["members"])) != 100:
        raise ValueError("The handoff must contain the frozen Best model and all 100 Average members.")
    config = json.loads((source / "precomputed/config.json").read_text())
    if len(config["features"]) != 145 or "ICV" not in config["features"]:
        raise ValueError("Unexpected feature schema.")
    for model in ("best", "average"):
        reference = json.loads((source / f"precomputed/{model}.reference.json").read_text())
        counts = {dx: sum(row["diagnosis"] == dx for row in reference["rows"]) for dx in ("CN", "MCI", "DA")}
        if counts != {"CN": 6223, "MCI": 5590, "DA": 2784}:
            raise ValueError(f"Unexpected {model} reference counts.")
    runtime = ROOT / ".spare-ad-runtime"
    runtime.mkdir(mode=0o700, exist_ok=True)
    target = runtime / "bundle"
    if target.is_symlink() or (target.exists() and not (target / "portfolio-integration.json").is_file()):
        raise ValueError("Refusing to replace an unmanaged runtime folder.")
    staging = Path(tempfile.mkdtemp(prefix=".prepare-", dir=runtime))
    try:
        for relative in [*hashes, "SHA256SUMS.json"]:
            destination = staging / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(source / relative, destination)
        # Numerical code, models, references and fixtures remain byte-for-byte intact.
        for path in (ROOT / "services/spare_ad/ui").iterdir():
            if path.is_file():
                shutil.copyfile(path, staging / "static" / path.name)
                hashes[f"static/{path.name}"] = hashlib.sha256(path.read_bytes()).hexdigest()
        (staging / "SHA256SUMS.json").write_text(json.dumps(hashes, indent=2) + "\n")
        (staging / "portfolio-integration.json").write_text(json.dumps({
            "verified_source_files": len(hashes), "model_count": 100,
            "reference_count_per_model": 14597, "feature_count": 145,
            "source_manifest_sha256": hashlib.sha256((source / "SHA256SUMS.json").read_bytes()).hexdigest(),
            "ui_overrides": [p.name for p in (ROOT / "services/spare_ad/ui").iterdir() if p.is_file()],
        }, indent=2) + "\n")
        staging.chmod(0o755)  # The read-only container mount uses a non-root user.
        previous = runtime / "previous-bundle"
        if previous.exists():
            if previous.is_symlink() or not (previous / "portfolio-integration.json").is_file():
                raise ValueError("Refusing to replace an unmanaged previous runtime.")
            shutil.rmtree(previous)
        if target.exists():
            target.rename(previous)
        staging.rename(target)
        return target
    finally:
        if staging.exists():
            shutil.rmtree(staging)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", required=True, type=Path, help="Extracted spare_ad_website handoff folder")
    args = parser.parse_args()
    print(f"Verified and prepared server-only resources: {prepare(args.bundle)}")
