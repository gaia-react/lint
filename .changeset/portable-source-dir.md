---
'@gaia-react/lint': minor
---

Convert the default export to a `gaiaLint(opts?)` factory. Accepts a
`sourceDir` option (default `'app'`) that scopes filename conventions,
hook-folder rules, and `no-relative-import-paths` to the consumer's
source root — so projects using `src/` (or any other layout) can drop
in `gaiaLint({sourceDir: 'src'})` without per-rule overrides.

`includeIgnoreFile` is now imported from `@eslint/config-helpers`
instead of the deprecated re-export in `@eslint/compat`. `@eslint/compat`
has been dropped as a dependency.

`ignores` is now dual-shape: spread it directly for the default case
(`...lint.ignores`) — `.gitignore` is auto-detected and silently
no-ops if the resolved path doesn't exist — or call it with options to
override (`...lint.ignores({extra: ['.gaia/**']})`). Pass
`{gitignore: false}` to opt out of the gitignore merge entirely, or
`{gitignore: 'path/...'}` for a non-standard location.

**Breaking:** the named static config exports (`base`, `react`,
`styleHygiene`, `guardrails`, `testing`, `storybook`, `playwright`,
`prettier`, `betterTailwind`, `ignores`) are gone. Access them off the
bundle returned by the factory:

```diff
- import gaiaLint from '@gaia-react/lint';
+ import gaiaLint from '@gaia-react/lint';
+ const lint = gaiaLint();

  export default defineConfig([
-   ...gaiaLint.ignores({gitignore: '.gitignore'}),
-   ...gaiaLint.base,
-   ...gaiaLint.react,
+   ...lint.ignores,
+   ...lint.base,
+   ...lint.react,
    // ...
  ]);
```
