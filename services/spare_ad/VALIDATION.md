# Local validation — October 21, 2026

The application was integrated and tested locally. No publication, external upload, DNS change or production access-policy change was performed.

- Original handoff integrity: **240 files verified** before integration.
- Prepared runtime integrity: **240 files verified**, with the three portfolio UI overrides recorded in the runtime checksum manifest. Numerical code and resources remain unchanged.
- Supplied portable suite: **5 tests passed**, including native Best/Average prediction parity at `1e-12` for probabilities, scores and trend distances; frozen reference behavior; missing-age fallback; and subpath/origin handling.
- Portfolio gateway suite: **5 tests passed**, covering real API inference, HTTPS-origin behavior, reference rendering without initializing inference, static-host fallback, and private-file denial including symlink paths.
- Both reference datasets: **14,597 rows** each — CN **6,223**, MCI **5,590**, DA **2,784**. Average model has **100 members**; Best model retains its frozen **0.06** cutoff, and Average retains **0.5**.
- Real Gunicorn/browser checks passed for both model uploads, fixture parity, all three score selectors, both trend shapes, MCI filters, predictions unchanged by display filters, batch CSV export, model-change clearing, private routes, and responsive widths **360, 390, 768 and 1440**. Mobile result tables scroll within the panel; legends have dedicated space.
- Existing portfolio/blog/admin browser checks passed, including research notes, full blog bibliographies, navigation, videos, publication filtering and owner-workspace behavior.
- Blog generation consistency, Python/JavaScript source parsing, and changed-file whitespace checks passed.
- A staged Pages artifact contained **146 public files** and no models, original identities, runtime bundle or row-level reference files.
- The reusable Python 3.11 environment was installed in `.venv-spare-ad/`. The local preview start command returned HTTP 200 for the portfolio, `/spare-ad/`, and the app health endpoint.
- Compose YAML parsed; loopback-only binding and read-only runtime/filesystem settings were checked. **The Docker image was not built or run** because Docker Desktop is not available to this WSL distribution. Real HTTPS/TLS and audience controls must be verified on the chosen deployment host.

Numerical environment: Python **3.11.13**, NumPy **1.26.4**, pandas **2.3.1**, XGBoost **3.0.0**, Gunicorn **26.2.0**. Tests used the handoff's opaque six-row fixture, not patient uploads.

See [README.md](README.md) for run commands, the same-origin Python deployment, and the GitHub Pages launch-page option.
