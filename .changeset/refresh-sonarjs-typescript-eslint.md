---
'@gaia-react/lint': minor
---

Refresh quarantined toolchain dependencies.

- `eslint-plugin-sonarjs` 4.0.3 → 4.1.0. This is a runtime dependency whose recommended rules this config spreads, so consumers may see new SonarJS findings on upgrade. Most are auto-fixable; treat them as signal.
- `typescript-eslint` 8.61.1 → 8.62.0. Held at 8.62.0 deliberately: 8.62.1 has not yet cleared the 7-day release-age quarantine, so 8.62.0 is the newest version that installs cleanly under a downstream release-age policy. A later release picks up 8.62.1 once it ages out.

Both bumps have cleared the 7-day release-age quarantine, so each installs cleanly with no new release-age exclusions required.
