---
"@gaia-react/lint": patch
---

Fixed: the stylelint config no longer reports every Tailwind `@apply` under `at-rule-prelude-no-invalid`. Stylelint 17's standard config validates at-rule preludes as CSS, and `@apply` takes utility class names, so the rule now ignores `@apply` and still checks every standard at-rule.
