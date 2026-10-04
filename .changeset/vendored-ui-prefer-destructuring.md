---
"@gaia-react/lint": patch
---

Fixed: `@typescript-eslint/prefer-destructuring` is off in vendored shadcn ui files. shadcn's `toast` component re-exports namespace members as `const a = Namespace.a`, which the rule reported on unedited `shadcn add` output.
