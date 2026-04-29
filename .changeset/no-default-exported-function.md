---
"@gaia-react/lint": patch
---

Close `prefer-arrow-functions` upstream gap for `export default function NamedFn(){}` via `no-restricted-syntax` selector.

The `eslint-plugin-prefer-arrow-functions` plugin has a hardcoded exemption (`guard.js:hasNameAndIsExportedAsDefaultExport`) that silently passes named default-exported declarations regardless of `allowNamedFunctions` setting. This release adds a `no-restricted-syntax` rule with selector `ExportDefaultDeclaration > FunctionDeclaration` to flag the pattern. Convert to `const Name = () => {}; export default Name;` instead. Ignored on `**/*.d.ts` since ambient declarations have no body to convert.
