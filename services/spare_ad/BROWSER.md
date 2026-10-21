# GitHub Pages browser implementation

The public `spare-ad/` directory contains the complete browser application. It requires no Python server, external API, Docker host, or separate hosting. The owner authorized public model parameters and reference records with subject IDs and cohort information removed.

## Computation

Best uses the original selected model; Average uses all 100 saved members. The export retains only inference arrays: tree structure, split values, leaf values, and base margins. Original UBJ files, training attributes/statistics, run labels, and identity mappings are excluded. The compressed model sizes are **35,326 bytes** (Best) and **5,358,347 bytes** (Average). These public inference arrays disclose the approved model parameters.

A dedicated module Web Worker parses CSVs, validates the ordered 145-feature input, rounds half to even, performs float32 ICV preprocessing and tree accumulation, and averages float32 member probabilities in double precision. It derives Index, Logit and Age-Z scores, then applies the supplied frozen nearest-trend classification, including ties, missing ages, and extrapolation. It neither retrains models nor refits reference trends.

Static assets load from the same origin with GET requests. Models load on first calculation, and their decompressed SHA-256 checksums are verified when Web Crypto is available. The gzip reader handles both compressed files and responses transparently decompressed by a CDN. Progress and cancellation keep the page responsive. Cancellation terminates the worker; a retry restores its model contexts before scoring.

## Public reference boundary

Each model retains **14,597** reference points (CN **6,223**, MCI **5,590**, DA **2,784**). An explicit row-field allowlist includes only `age`, `diagnosis`, `ethnicity`, `p`, `index`, `logit`, `age_z`, and `prediction`. Subject identifiers, cohort labels, and source partition labels are removed, including from reference hover labels and filters. Cohort metadata is also stripped from numerical fit descriptions and the app’s methods text.

Rows are independently shuffled for Best and Average using a local random key that stays in the ignored private runtime. No original identity mapping, identifier hash, or replacement identifier is published. Normalization coefficients, trend coefficients, trend lines, cutoffs, and retained numerical measurements are unchanged. Age, diagnosis, ethnicity and derived individual measurements remain publicly downloadable; this is a reference-point explorer rather than an aggregate-only release.

Visitor CSVs are handled only in worker/tab memory; their optional IDs and cohort metadata may appear in their own local results and exported CSVs. There is no HTTP upload, persistence, analytics, or backend prediction call in the app. The browser cannot perform the original private identity lookup, so it exports `reference_overlap: null` and `reference_overlap_status: "not_checked_browser"`.

## Numerical validation and limits

Both models match the supplied six-row native fixtures at **1e-12** tolerance for probabilities, all three scores and distances, and the original labels/statuses across all six score/trend combinations. Browser checks also verify cancellation/retry, complete CSV export despite display filters, responsive layout, and static GET traffic only.

A separate deterministic 262-row synthetic check showed zero Best-model probability differences and a maximum Average-model probability difference of **2.98e-10** versus this machine’s native XGBoost runtime. JavaScript’s exponential function and a platform’s native float32 exponential can differ. These measured differences are not an all-input error bound, bitwise parity guarantee, or clinical validation. Inputs near decision boundaries may be sensitive to floating-point differences.

## Source and regeneration

- `browser/engine.mjs`: float32 tree inference, score transforms, frozen trend classification.
- `browser/csv.mjs`: quoted CSV parsing, feature and metadata validation.
- `browser/worker.mjs`: local inference and reclassification.
- `browser/browser-api.mjs`: static downloads and worker messaging.
- `browser/compression.mjs`: gzip handling for static/CDN responses.
- `browser/app.mjs`: plots, filters, local results, export, progress and cancellation.
- `browser/methods.html`: public methods description with cohort labels removed.
- `scripts/export_spare_ad_browser.py`: inference-only export and private native-fixture generation.
- `scripts/prepare_spare_ad_static.py`: sanitization, independent shuffling and static assembly.
- `scripts/verify_spare_ad_public.py`: public allowlist, privacy and checksum audit; private-source comparison when available.

See [README.md](README.md) for rebuild and preview commands. Generated assets are committed with the website; Actions audits and publishes them without accessing private resources.
