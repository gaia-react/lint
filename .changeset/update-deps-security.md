---
"@gaia-react/lint": patch
---

Update toolchain dependencies and resolve security advisories.

- Bump `stylelint-config-clean-order` 8 → 10 (CSS property-ordering updates: logical `inset` properties now sort before their physical equivalents; typography properties repositioned — no API or option changes)
- Patch-bump `eslint-plugin-prettier`, `@vitest/eslint-plugin`, and `@eslint-community/eslint-plugin-eslint-comments`
- Resolve transitive advisories: `brace-expansion` → 5.0.6 (GHSA-jxxr-4gwj-5jf2), `fast-uri` → 3.1.2 (GHSA-q3j6-qgpj-74h6, GHSA-v39h-62p7-jpjc)
