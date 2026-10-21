# Local validation — October 21, 2026

The browser-only application is prepared locally for the existing GitHub Pages workflow. No files have been pushed or published, and no external hosting, DNS, or production configuration was changed.

## Static application

- Both Best and full 100-member Average models passed an actual Chromium test against the local static preview. Across all six score/trend combinations per model, probabilities, Index/Logit/Age-Z scores and trend distances matched the supplied six-row native fixtures at **1e-12** tolerance; labels and statuses matched.
- Display filters preserved the complete batch export and triggered no new inference. MCI reference count was **5,590**. Reference hover labels contained no subject identifiers, and cohort/source-partition filters were absent.
- Cancellation during the Average model download and retry passed. Layout checks passed at **360, 390, 768 and 1440** pixels.
- Browser request inspection confirmed **static GET requests only**, with no POST, network API calls, CSV transmission, browser storage, or JavaScript page errors.
- An additional deterministic **262-row** synthetic numerical check measured maximum probability difference **0** for Best and **2.98e-10** for Average against native XGBoost. This is an empirical result, not a bound or bitwise guarantee for all inputs; JavaScript/native exponential implementations can differ.

## Publication and privacy

- Public asset audit passed for both **14,597-row** references: CN **6,223**, MCI **5,590**, DA **2,784**. Only approved row and fit fields are present; subject IDs, cohort labels and source partition labels are removed. Original identity mappings and shuffle keys are excluded.
- Local comparison against the private source confirmed every retained reference measurement, normalization coefficient, trend coefficient and trend line is unchanged. Independent shuffling changes row order only.
- Converted model SHA-256 checksums, binary sizes, 145-feature schema and model counts passed. Best cutoff remains **0.06**, Average **0.5**.
- The staged Pages artifact contains **161 public files**, including **19** static app files. It contains the approved inference arrays and sanitized reference points, and excludes native UBJ models, the private runtime, identity maps, fixtures, source services, virtual environments and symlinks.
- Negative privacy checks rejected injected subject IDs, cohort metadata and trend-line identifiers.
- The Pages workflow now runs the standard-library public audit before staging. It needs no private handoff or Python ML dependencies.

## Regression and source checks

- All **5** portfolio/native integration tests passed, including explicit native fixture comparison, HTTPS-origin behavior, reference access without inference initialization, private-path/symlink denial, and the static browser app remaining the default even when the native bundle exists.
- Existing portfolio/blog/admin browser checks passed: all five articles and bibliographies, research dialogs, navigation, videos, publication filtering, responsive layouts and mocked owner-workspace operations.
- Blog generation consistency and Python/JavaScript source parsing passed.
- The original handoff’s **240** file checksums were verified; its numerical resources were not modified. Native validation used Python **3.11.13**, NumPy **1.26.4**, pandas **2.3.1** and XGBoost **3.0.0**.

Tests used the supplied opaque six-row fixture and synthetic inputs, not visitor or patient uploads. Production GitHub Pages delivery has not been exercised because deployment is outside this local change. The app remains a research tool; numerical fixture parity is not clinical validation. See [BROWSER.md](BROWSER.md) for implementation limits and [README.md](README.md) for preview/rebuild commands.
