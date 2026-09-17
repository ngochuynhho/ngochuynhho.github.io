# Ngoc-Huynh Ho · Research portfolio

A responsive portfolio for GitHub Pages, with research notes, a searchable bibliography, Google Scholar citation updates, and an owner workspace for reviewing new papers. The redesign preserves all 48 existing bibliography records and the complete supplied career history.

## Preview locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. Open `http://localhost:8000/admin.html` for the owner workspace. The public portfolio also works when `index.html` is opened directly from disk using embedded fallback data. The admin page needs HTTP to load its configuration.

## Enable live Scholar updates and admin scanning

The public site does not need a backend server. Scholar requests run in GitHub Actions; the owner workspace authenticates directly with GitHub. **Live scanning requires this one-time repository setup; it is not active merely by editing these local files.**

1. Commit and push these files to the default branch of `ngochuynhho/ngochuynhho.github.io`.
2. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. The `Deploy portfolio` workflow publishes the public files only. Backups, scripts, tests, and unrelated local build directories are excluded.
3. Obtain a [SerpApi Google Scholar Author API](https://serpapi.com/google-scholar-author-api) key. Check the provider’s quota and plan before subscribing. Direct browser scraping of Scholar is not used.
4. In **Settings → Secrets and variables → Actions**, create the repository secret **`SERPAPI_KEY`**. Never put this key in HTML, JavaScript, or a public JSON file.
5. Allow the **Scholar sync** workflow to write repository contents. The workflow declares `contents: write`; repository or organization policy must permit it. Enable scheduled workflows if GitHub has disabled them.
6. Run **Actions → Scholar sync → Run workflow** once to verify the integration. The daily scan is scheduled for **11:17 UTC**; GitHub may delay scheduled runs. A failed scan preserves the previous public snapshot.
7. Create a [GitHub fine-grained personal access token](https://github.com/settings/personal-access-tokens/new) as **`ngochuynhho`**. Select only **`ngochuynhho.github.io`**, with **Contents: read and write** and **Actions: read and write**. Set an expiration. No workflow-file write permission is needed.
8. Open **Admin** in the site footer and sign in with that token. A scan starts automatically. The panel reports new papers and provides editable metadata, **Add publication**, and **Ignore this record**.

The login is a GitHub token login, rather than a separate username/password account. GitHub verifies identity and authorizes each operation. The owner login is checked against `data/site-config.json`. Tokens are held only in the tab’s memory, are never stored in browser storage, and are cleared on sign-out or reload. Only this owner panel connects to GitHub; public visitors read static research data.

The admin panel identifies its own scan by a unique workflow request ID. It reads fresh results directly from the repository, so it does not wait for a Pages cache. Publishing or ignoring a record saves `data/publications.json` as a GitHub commit. The Pages deployment then updates the portfolio. Branch protections that forbid direct commits need to be adjusted for this workflow or records must be merged through the repository instead.

The public citation count initially retains **1,089**, the value supplied in the old website, and explicitly labels it as previously recorded. It becomes a dated Google Scholar count after the first successful scan. No current citation number was invented or claimed during the redesign.

## Research content

- `data/publications.json`: all bibliography records and ignored Scholar identities.
- `data/topics.json`: five research notes, their problem definitions, methods, significant findings, conceptual illustrations, and original YouTube links.
- `data/scholar.json`: the most recent successful citation metrics and Scholar article list.
- `data/site-config.json`: repository owner, admin account, workflow name, and Scholar author ID (`dYRENHsAAAAJ`). This configuration contains no secrets.

The five themes cover dementia and trustworthy AI; brain aging and vascular health; multimodal emotion and social AI; medical image analysis; and mobile sensing and intelligent interaction. Journal papers determine the project counts and source lists. New approved journal papers appear under their selected theme automatically. Edit the corresponding research note to describe new findings.

Publication type and theme suggested by a scan are heuristics and must be reviewed. Titles, Scholar IDs, and available DOIs prevent duplicate suggestions; ignored records stay ignored. Conferences, domestic publications, patents, the thesis, and the poster remain available under **All work**. Existing bibliographic metadata is preserved, with the malformed `110.1109/ACCESS.2019.2949125` DOI corrected.

Each note links to its source papers. The SPAN research note’s quantitative findings are from the [2023 Scientific Reports article](https://www.nature.com/articles/s41598-023-37500-7), and the related longitudinal prediction work is linked to the [2022 Neural Networks paper](https://pubmed.ncbi.nlm.nih.gov/35364417/). Illustrations in `assets/img/research/` are original conceptual diagrams. Publisher figure servers did not provide usable image responses during development, so the site does not depend on unavailable images. If you replace a diagram with a paper figure, include its source and required license credit in `image_caption`.

The public page includes embedded bibliography and topic data as a fallback for direct file previews or network errors. When hosted, current JSON files take priority. If you want to refresh the fallback after a manual content edit, update its `initial-publications` or `initial-topics` JSON block in `index.html`; the hosted site does not require this.

## Backups and recovery

The full **pre-change working copy**, including previously uncommitted website edits, is saved locally at:

```text
.backups/ngochuynhho-website-backup-20260916-205108.tar.gz
```

A second copy exists in `/tmp/ngochuynhho-website-backup-20260916-205108.tar.gz`. Keep the workspace copy; `/tmp` may be cleared. `.backups/` is ignored by Git and excluded from the Pages deployment.

Create another full backup:

```bash
python3 scripts/backup_site.py
```

Restore the original working copy:

```bash
python3 scripts/backup_site.py --restore .backups/ngochuynhho-website-backup-20260916-205108.tar.gz
```

Restoration first backs up the current site, validates archive paths, then restores the archived files. Files introduced after the archive remain on disk; the original `index.html` uses the original assets again.

Each Actions scan uploads **research-data-before-scan-RUN_ID** as a downloadable artifact retained for 30 days, and the sync script takes another local data backup before atomically replacing `scholar.json`. The owner panel’s **Download data backup** exports the loaded bibliography, Scholar snapshot, and research notes. To recover exported data, copy the export’s `publications`, `scholar`, and `topics` objects into their respective JSON files, then commit them. GitHub commit history also records every publication edit and successful scan.

## Verification

Python 3.12 or newer is recommended for the backup restore command.

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
node --test tests/research-core.test.js
```

Browser checks are provided in `tests/browser-checks.js`; install Playwright outside the site and run the script with `NODE_PATH` pointing to that installation’s `node_modules`. The script starts its own localhost preview, or uses an existing preview supplied through `SITE_URL`. It checks the public page, responsive layout, research dialogs, filtering, and the admin scan/publish flow against mocked GitHub responses. Real API scanning requires the repository secret and is not covered by the mocks.

The original BootstrapMade attribution is retained. Existing vendor assets and other local work are preserved.
