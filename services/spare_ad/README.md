# Fair SPARE-AD on GitHub Pages

The complete application lives at **`/spare-ad/`** and runs entirely in the browser. It includes both model choices, the reference explorer, Index/Logit/Age-Z scores, frozen straight/quadratic trends, filters, progress/cancellation, and CSV export. The portfolio publication, dementia research note, and blog bibliography link to it.

No additional hosting, backend, runtime Python packages, or API credentials are required. The original Python integration is retained only for numerical comparison.

## Preview and publish

From the website repository:

```bash
python3 scripts/serve_portfolio.py --port 8000
```

Open **http://127.0.0.1:8000/spare-ad/**. This server exposes an explicit public-file allowlist; use it instead of serving the repository root with a generic static server. In production, the existing `.github/workflows/pages.yml` audits the app and includes `spare-ad/` in the Pages artifact. Committing and pushing the prepared files through the normal website workflow is sufficient; no service URL needs configuring.

Use a current browser with JavaScript modules, Web Workers, and `DecompressionStream`. Best model parameters download on first calculation (~35 KB compressed); Average downloads its full 100-member ensemble (~5.36 MB compressed). Models are reused while the worker remains active. Cancellation stops the worker; the next calculation starts a fresh worker.

## Data and privacy

The owner approved public inference parameters and de-identified reference points. Public reference files omit **all subject IDs, cohort names, and source partition labels** and shuffle row order independently per model. They retain ages, diagnoses, ethnicity, probabilities, derived scores, predictions, and frozen numerical fits. Removing identifiers does not make those retained individual measurements aggregate data.

Original identity mappings and the private shuffle key are never included. Visitor CSVs, including their optional ID or cohort columns, stay in tab memory and local exports. No CSV is sent to a server or stored in browser storage. The browser cannot check overlap with a private identity mapping: exports explicitly use `reference_overlap = null` and `reference_overlap_status = not_checked_browser`.

See [BROWSER.md](BROWSER.md) for architecture and numerical limits, and [VALIDATION.md](VALIDATION.md) for test results.

## Rebuild after changing source assets

The public app is already generated. Rebuilding requires the original private handoff and the local native Python environment; neither is needed to serve or deploy the generated website.

```bash
# Only if the verified private bundle has not been prepared:
.venv-spare-ad/bin/python scripts/prepare_spare_ad.py --bundle /mnt/d/Clone_GitHub/resources/spare_ad_website

.venv-spare-ad/bin/python scripts/export_spare_ad_browser.py
python3 scripts/prepare_spare_ad_static.py --install
python3 scripts/verify_spare_ad_public.py
```

`export_spare_ad_browser.py` writes inference arrays and native validation fixtures only under the ignored `.spare-ad-runtime/browser-development/`. `prepare_spare_ad_static.py` assembles sanitized files there; **`--install`** copies the approved static app into public `spare-ad/`. Its explicit file and field allowlists exclude identities, native model files, and private fixtures. The private shuffle key persists locally so rebuilding gives stable row order. Retain that key privately if reproducible regeneration matters.

After editing browser sources or the shared UI stylesheet, rerun the assembly command. The Pages audit rejects a mismatch between generated core JavaScript and its tracked source.

## Checks

```bash
python3 scripts/verify_spare_ad_public.py
.venv-spare-ad/bin/python -m unittest discover -s tests -p test_spare_ad.py -v
SPARE_AD_SITE_URL=http://127.0.0.1:8000 node tests/spare-ad-browser.js
```

The public audit uses Python’s standard library and works without the private bundle, including in Actions. When that bundle is available, it also compares every retained reference value and frozen fit against the originals. The native and browser parity tests need the local private fixtures and native environment; browser tests additionally require Playwright and Chromium, with `NODE_PATH` pointing to Playwright if installed outside the repository.

## File boundaries

- `spare-ad/`: deployable static app, inference arrays, sanitized references, Plotly and its license notices.
- `services/spare_ad/browser/`: maintained browser sources and sanitized methods text.
- `services/spare_ad/ui/`: shared original UI template and stylesheet used during assembly.
- `scripts/verify_spare_ad_public.py`: publication audit used by the Pages workflow.
- `.spare-ad-runtime/` and `.venv-spare-ad/`: ignored private development resources, excluded from Pages and website backups.
- `services/spare_ad/server.py`: safe static preview by default. The original native adapter requires explicit `SPARE_AD_LEGACY_BACKEND=1`; its retained Docker configuration is optional and is not used by GitHub Pages.

`python3 scripts/backup_site.py` saves website source and generated public assets under `.backups/`. It excludes the private runtime and virtual environment; keep the original handoff in private storage.
