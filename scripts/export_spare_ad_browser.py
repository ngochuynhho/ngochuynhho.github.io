#!/usr/bin/env python3
"""Export inference-only tree arrays for local browser validation; no public writes."""
import argparse
import gzip
import hashlib
import json
from pathlib import Path
import struct
import sys

import numpy as np
import xgboost as xgb

ROOT = Path(__file__).resolve().parents[1]


def export_members(bundle, members):
    margins, offsets, roots, left, right, features, values = [], [0], [], [], [], [], []
    for member in members:
        booster = xgb.Booster()
        booster.load_model(bundle / "private/models" / member / "model.ubj")
        learner = json.loads(booster.save_raw(raw_format="json"))["learner"]
        parameters = learner["learner_model_param"]
        if learner["objective"]["name"] != "binary:logistic" or float(parameters["base_score"]) != 0.5:
            raise ValueError("This export supports the supplied binary logistic models with base probability 0.5 only.")
        if parameters["num_feature"] != "145" or parameters["num_target"] != "1" or learner["gradient_booster"]["name"] != "gbtree":
            raise ValueError("Unexpected model structure.")
        model = learner["gradient_booster"]["model"]
        if set(model["tree_info"]) != {0} or model["gbtree_model_param"]["num_parallel_tree"] != "1":
            raise ValueError("Unsupported multi-output or parallel-tree model.")
        margins.append(0.0)
        for tree in model["trees"]:
            if any(tree["split_type"]) or tree["categories"] or int(tree["tree_param"]["num_deleted"]):
                raise ValueError("Only the supplied noncategorical trees are supported.")
            start = len(left)
            roots.append(start)
            left.extend(-1 if node < 0 else node + start for node in tree["left_children"])
            right.extend(-1 if node < 0 else node + start for node in tree["right_children"])
            features.extend(int(feature) | (int(missing) << 31) for feature, missing in zip(tree["split_indices"], tree["default_left"]))
            values.extend(tree["split_conditions"])
        offsets.append(len(roots))
    header = struct.pack("<8s6I", b"SPAD0001", len(margins), 145, len(roots), len(left), 0, 0)
    arrays = [(margins, "<f4"), (offsets, "<u4"), (roots, "<u4"), (left, "<i4"), (right, "<i4"), (features, "<u4"), (values, "<f4")]
    return header + b"".join(np.asarray(array, dtype=dtype).tobytes() for array, dtype in arrays)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", type=Path, default=ROOT / ".spare-ad-runtime/bundle")
    parser.add_argument("--output", type=Path, default=ROOT / ".spare-ad-runtime/browser-development/models")
    args = parser.parse_args()
    output = args.output.resolve()
    # Explicitly prevent accidental export into a public website directory.
    if not output.is_relative_to((ROOT / ".spare-ad-runtime").resolve()):
        raise ValueError("Development exports must stay under the ignored .spare-ad-runtime directory.")
    output.mkdir(parents=True, exist_ok=True)
    manifest = json.loads((args.bundle / "private/model_manifest.json").read_text())
    result = {}
    for name in ("best", "average"):
        payload = export_members(args.bundle, manifest["models"][name]["members"])
        compressed = gzip.compress(payload, compresslevel=9, mtime=0)
        (output / f"{name}.bin.gz").write_bytes(compressed)
        result[name] = {"model_count": len(manifest["models"][name]["members"]), "bytes": len(payload), "gzip_bytes": len(compressed), "sha256": hashlib.sha256(payload).hexdigest()}
    (output / "manifest.json").write_text(json.dumps(result, indent=2) + "\n")
    # Numerical validation stays private, outside the generated static asset tree.
    sys.path.insert(0, str(args.bundle.resolve()))
    from app.service import PortableService
    service = PortableService(args.bundle.resolve())
    csv = (args.bundle / "private/smoke_input.csv").read_text()
    expected = {}
    for name in ("best", "average"):
        scored = service.predict(name, csv)
        expected[name] = {f"{score}_{trend}": service.reclassify(name, scored["rows"], score, trend)["rows"]
                          for score in ("index", "logit", "age_z") for trend in ("linear", "curve")}
    (output.parent / "expected-all.json").write_text(json.dumps(expected))
    print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
