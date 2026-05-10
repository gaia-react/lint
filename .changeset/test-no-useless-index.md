---
"@gaia-react/lint": patch
---

Enable `import-x/no-useless-path-segments` with `noUselessIndex: true` in the testing config.

Auto-rewrites `import X from '../index'` → `import X from '..'` on `pnpm lint --fix` for `*.test.ts?(x)`, `*.stories.ts?(x)`, and `test/**/*.ts?(x)`. Aligns with GAIA's `Component/index.tsx` + `Component/tests/index.test.tsx` convention where sibling-index imports are intentional. Globally scoped `import-x/no-useless-path-segments` remains off in the base config.
