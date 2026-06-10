---
"@gaia-react/lint": patch
---

Bump `eslint-plugin-storybook` to 10.4.2.

The package now adopts the same supply-chain hardening as the consuming app: a 7-day release-age quarantine (`minimumReleaseAge`) and pnpm `trustPolicy: no-downgrade`. Because the config can only ever pin dependencies that have already cleared the 7-day window, every published release installs cleanly under a downstream release-age policy with no per-dependency exclusions required.
