# Fair SPARE-AD portfolio integration

This adds the supplied application at `/spare-ad/` while serving the existing portfolio on the same origin. Links appear with the Nature Communications paper, in the dementia research note, and in the related blog bibliography. No website was published, DNS changed, or resource bundle uploaded.

## Run locally

Use Python 3.11. On this workstation it is available as `/home/henryho/miniconda3/envs/vid2mp3/bin/python`; use `python3.11` below where available, or substitute that interpreter for the environment-creation command.

From the website repository:

```bash
python3.11 -m venv .venv-spare-ad
.venv-spare-ad/bin/python -m pip install -r services/spare_ad/requirements.txt
.venv-spare-ad/bin/python scripts/prepare_spare_ad.py --bundle /mnt/d/Clone_GitHub/resources/spare_ad_website
.venv-spare-ad/bin/python scripts/serve_portfolio.py --port 8000
```

Open **http://127.0.0.1:8000/** for the portfolio and **http://127.0.0.1:8000/spare-ad/** for the full app. This preview binds to loopback. Use the integrated server instead of `python -m http.server`, which would expose arbitrary repository files.

The preparation command verifies every source checksum, the 145-feature schema, 100 ensemble members, and reference counts, then copies the bundle into **`.spare-ad-runtime/bundle/`**, which Git ignores. It applies the tracked UI files in `services/spare_ad/ui/` to that copy and updates their runtime checksums; numerical code, models, reference files and numerical fixtures remain unchanged. The original handoff is never modified. Rerun preparation after changing the UI overrides; the previous managed runtime is kept in `.spare-ad-runtime/previous-bundle/`.

`SPARE_AD_BUNDLE` can select another prepared bundle path. The app imports native inference dependencies and initializes the service only for prediction/reclassification requests; page, schema, health and reference requests do not load models or fit data. Every reference point, trend coordinate, coefficient and Age-Z normalization comes from the handoff.

## Hosting options prepared for review

### Same-origin Python host (full application at `/spare-ad/`)

Run the gateway behind an existing HTTPS reverse proxy on a Python-capable server. It serves both the portfolio and the original backend adapter. Configure the **exact public HTTPS origin**, without a path or trailing slash:

```bash
APP_PUBLIC_ORIGIN=https://your-domain.example \
  .venv-spare-ad/bin/gunicorn --bind 127.0.0.1:8765 \
  --workers 1 --threads 2 --timeout 300 services.spare_ad.server:application
```

`nginx.conf.example` is the location block for that HTTPS site; use your existing certificate configuration. Same-origin API requests and the original origin check remain in place. There is no wildcard CORS. Keep any existing gateway authentication in front of this route. Reference responses contain individual ages, diagnoses and scores, so apply the intended data-sharing audience to the **whole `/spare-ad/` route**, including its GET APIs.

Docker alternative, also from the repository root:

```bash
cp services/spare_ad/.env.example .env.spare-ad
# Set APP_PUBLIC_ORIGIN to your exact HTTPS origin before production use.
docker compose --env-file .env.spare-ad -f services/spare_ad/compose.yaml config --quiet
docker compose --env-file .env.spare-ad -f services/spare_ad/compose.yaml up --build -d
```

Run preparation first. The image uses Python 3.11 and a non-root user. A **read-only bind mount**, not an image layer, supplies the private bundle. The container exposes only `127.0.0.1:8765`, has a read-only filesystem and a temporary `/tmp`, and its health check performs no inference. Do not push a resource-bearing image or bundle to a public registry/repository.

### Keep GitHub Pages and host the app separately

GitHub Pages cannot run the Python/native-XGBoost backend or proxy a path on `ngochuynhho.github.io` to it. The Pages build publishes only the lightweight `spare-ad/` launch page, without reference rows, models or backend source. After deploying the Python service above, put its full HTTPS app URL in **`spare-ad/service.json`**, for example:

```json
{"service_url": "https://research.your-domain.example/spare-ad/"}
```

The launch page then offers **Open Fair SPARE-AD** in a new tab. All API calls and uploads stay on the research service's own origin. An empty URL clearly states that the service has not been connected. No inference is simulated on GitHub Pages. For a seamless same-origin app, serve the portfolio through the Python gateway on your own domain instead.

No host, public hostname, access-control policy, certificate or DNS setting was assumed or changed. These are the remaining operator choices before publication. Docker build and TLS validation require the destination Docker engine and HTTPS host.

## Validation

Before preparation, validate the original bundle:

```bash
PYTHONDONTWRITEBYTECODE=1 .venv-spare-ad/bin/python /mnt/d/Clone_GitHub/resources/spare_ad_website/verify_bundle.py
```

After preparation:

```bash
(cd .spare-ad-runtime/bundle && ../../.venv-spare-ad/bin/python verify_bundle.py && PYTHONDONTWRITEBYTECODE=1 ../../.venv-spare-ad/bin/python -m unittest discover -s tests -v)
PYTHONDONTWRITEBYTECODE=1 .venv-spare-ad/bin/python -m unittest discover -s tests -p test_spare_ad.py -v
node scripts/build_blog.mjs --check
```

The numerical suite checks native Best/Average fixture parity at `1e-12`, all scores and distances, missing-age fallback, fixed trend reclassification and mount/origin behavior. Integration tests cover the complete gateway, reference rendering without inference initialization, private-file denial (including symlinks), fixture parity through HTTP handlers, HTTPS origin checks and the static-host fallback.

For browser checks, start the integrated server above, then use an existing Playwright installation:

```bash
SPARE_AD_SITE_URL=http://127.0.0.1:8000 node tests/spare-ad-browser.js
```

The browser test uses only the supplied opaque six-row fixture. It verifies both model choices, all three scores, straight/quadratic trends, MCI reference/filter behavior, unchanged predictions after display filters, batch CSV export and mobile layout. Upload bodies stay in memory; the service adds no patient database, upload-file storage, analytics or email.

## File and deployment boundaries

- `spare-ad/`: static public launch page and optional HTTPS service link.
- `services/spare_ad/ui/`: portfolio branding/navigation around the supplied browser app; no bundled model/reference data.
- `services/spare_ad/server.py`: same-origin gateway and explicit public-file allowlist.
- `scripts/prepare_spare_ad.py`: verified, ignored runtime preparation.
- `.spare-ad-runtime/`: server-only models, identity mapping, fixtures and reference data. Never stage or publish this directory.
- `.github/workflows/pages.yml`: stages only the public launch page alongside the existing public files; excludes `services/` and the entire private runtime.

Local website backups include the new integration source, launcher and configuration. They deliberately exclude the runtime and virtual environment; retain the original handoff archive in its intended private storage. Do not use a repository-root static file server for this integration.
