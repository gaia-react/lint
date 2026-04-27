# @gaia-react/lint

GAIA's lint configuration.

## Install

```sh
pnpm add -D @gaia-react/lint eslint prettier typescript
```

## Quick start

The block below is the actual `eslint.config.mjs` shipped by GAIA. Copy it
verbatim and adjust the override block at the bottom for your project.

```js
import gaiaLint from '@gaia-react/lint';
import {defineConfig} from 'eslint/config';

export default defineConfig([
  ...gaiaLint.ignores({gitignore: '.gitignore'}),
  ...gaiaLint.base,
  ...gaiaLint.react,
  ...gaiaLint.testing,
  ...gaiaLint.storybook,
  ...gaiaLint.playwright,
  ...gaiaLint.styleHygiene,
  ...gaiaLint.guardrails,
  ...gaiaLint.betterTailwind({
    entryPoint: './app/styles/tailwind.css',
    ignore: ['plain-link', 'plain-table'],
  }),
  ...gaiaLint.prettier,
]);
```

## Exports

| Export           | Shape                            | Includes                                                                                                                                          | Required? |
| ---------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `base`           | `Linter.Config[]`                | JS recommended, TypeScript (typescript-eslint), `import-x`, `eslint-comments`, `prefer-arrow-functions`, lodash/underscore guard                  | required  |
| `react`          | `Linter.Config[]`                | `eslint-plugin-react`, `react-hooks`, `jsx-a11y`, GAIA-specific React rules                                                                       | required for React apps |
| `styleHygiene`   | `Linter.Config[]`                | `canonical`, `perfectionist`, `unicorn`, `unused-imports`, `check-file`                                                                           | required  |
| `guardrails`     | `Linter.Config[]`                | `no-enum` (custom), `no-switch` (custom), `no-relative-import-paths`, `sonarjs`, `eslint-comments`, `import-x`, `prefer-arrow-functions`          | required  |
| `testing`        | `Linter.Config[]`                | Vitest + Testing Library config scoped to `*.test.*` and `test/`                                                                                  | optional  |
| `storybook`      | `Linter.Config[]`                | `eslint-plugin-storybook` scoped to `*.stories.*`                                                                                                 | optional  |
| `playwright`     | `Linter.Config[]`                | `eslint-plugin-playwright` scoped to `e2e/`                                                                                                       | optional  |
| `prettier`       | `Linter.Config[]`                | `eslint-config-prettier` — must be **last** to disable formatting rules                                                                           | required if using Prettier |
| `betterTailwind` | `(opts) => Linter.Config[]`      | `eslint-plugin-better-tailwindcss` factory; takes `entryPoint` (path to Tailwind entry CSS) and optional `ignore` (class names to skip)           | optional  |
| `ignores`        | `(opts?) => Linter.Config[]`     | `includeIgnoreFile` helper plus GAIA defaults; takes optional `gitignore` (path) and `extra` (string[])                                           | recommended |

The default export bundles every named export:

```js
import gaiaLint from '@gaia-react/lint';
// gaiaLint.base, gaiaLint.react, gaiaLint.betterTailwind({...}), ...
```

## Override patterns

Flat config is last-write-wins. Append override blocks **after** the
gaia-lint spreads to disable, change, or scope rules.

### Disable a rule globally

```js
export default defineConfig([
  ...gaiaLint.base,
  ...gaiaLint.react,
  {rules: {'sonarjs/cognitive-complexity': 'off'}},
]);
```

### Override on specific globs

```js
export default defineConfig([
  ...gaiaLint.base,
  ...gaiaLint.react,
  {
    files: ['app/legacy/**'],
    rules: {'sonarjs/cognitive-complexity': 'off'},
  },
]);
```

### Swap parser options

```js
export default defineConfig([
  ...gaiaLint.base,
  {
    languageOptions: {
      parserOptions: {project: './tsconfig.eslint.json'},
    },
  },
]);
```

### Add an extra plugin

```js
import myPlugin from 'eslint-plugin-my-plugin';

export default defineConfig([
  ...gaiaLint.base,
  ...gaiaLint.react,
  {
    plugins: {'my-plugin': myPlugin},
    rules: {'my-plugin/some-rule': 'error'},
  },
]);
```

## Peer dependencies

`eslint`, `prettier`, and `typescript` are declared as **peer
dependencies** so consumers control their own versions and a single resolved
copy of each is installed in `node_modules`. Every other plugin
(`eslint-plugin-react`, `typescript-eslint`, `eslint-plugin-import-x`, etc.)
ships as a direct `dependency` of `@gaia-react/lint` so consumers don't
have to install or upgrade them individually.

Supported versions:

- `eslint ^9.0.0`
- `prettier ^3.0.0`
- `typescript ^5.0.0 || ^6.0.0`

## Custom rules included

Two rules are implemented inside this package and ship as part of
`guardrails`.

### `no-enum`

Forbids TypeScript `enum` declarations. Enums emit runtime code, are not
tree-shakeable, conflate value and type space, and have well-known footguns
around numeric vs string enums and reverse mappings. Use a `const` object
plus a derived union type instead.

```ts
// flagged
enum Status {
  Active,
  Inactive,
}

// preferred
const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const;
type Status = (typeof Status)[keyof typeof Status];
```

Opt out for a file or block:

```js
{files: ['src/legacy/**'], rules: {'no-enum/no-enum': 'off'}}
```

### `no-switch`

Forbids `switch` statements. They are an early-return / lookup-map / `if`
chain in disguise and are easy to misuse (fallthrough, missing `default`,
shadowed locals across cases). Replace with a lookup object, an early
`return` chain, or a discriminated-union exhaustiveness check.

Opt out for a file or block:

```js
{files: ['src/parser/**'], rules: {'no-switch/no-switch': 'off'}}
```

## Tailwind / better-tailwindcss factory

`betterTailwind` is a factory because the underlying plugin needs to know
where your Tailwind entry CSS file lives.

```js
...gaiaLint.betterTailwind({
  entryPoint: './app/styles/tailwind.css',
  ignore: ['plain-link', 'plain-table'],
}),
```

| Option       | Type       | Required | Description                                                                                  |
| ------------ | ---------- | -------- | -------------------------------------------------------------------------------------------- |
| `entryPoint` | `string`   | yes      | Path to your Tailwind entry CSS, used by the plugin to resolve the active class set.         |
| `ignore`     | `string[]` | no       | Class names the plugin should ignore in `no-unregistered-classes` (e.g. design-system tokens, `plain-*` utility shims). |

## Ignores factory

`ignores` produces a leading flat-config block that merges your
`.gitignore` plus GAIA defaults.

```js
...gaiaLint.ignores({
  gitignore: '.gitignore',
  extra: ['coverage/**', '**/*.generated.ts'],
}),
```

| Option     | Type       | Required | Description                                                                                          |
| ---------- | ---------- | -------- | ---------------------------------------------------------------------------------------------------- |
| `gitignore`| `string`   | no       | Path to a `.gitignore` file (relative to `cwd` or absolute). Patterns are merged via `includeIgnoreFile`. |
| `extra`    | `string[]` | no       | Extra ignore globs merged with GAIA defaults.                                                        |

## GAIA folder conventions baked into `check-file`

The `check-file` rules in `styleHygiene` encode GAIA's folder layout:

- `app/components/**` — component file naming
- `app/pages/**` — route/page file naming
- `app/hooks/**` — hook file naming (`use-*.ts`)
- `test/**` — test harness naming

If your project uses a different layout, override the relevant
`check-file/*` rules **after** the `styleHygiene` spread:

```js
export default defineConfig([
  ...gaiaLint.base,
  ...gaiaLint.styleHygiene,
  // Project uses src/ instead of app/
  {
    files: ['src/components/**'],
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {'src/components/**/*.{ts,tsx}': 'PASCAL_CASE'},
      ],
    },
  },
]);
```

Or disable the GAIA `check-file` block entirely and reapply your own:

```js
{rules: {'check-file/folder-naming-convention': 'off'}}
```

## Versioning policy

This package follows SemVer.

- **Patch.** Plugin version bumps that do not change rule defaults, internal
  refactors, README fixes.
- **Minor.** New rules added, new options exposed on factories, new named
  exports, opt-in changes that do not break existing consumer configs.
- **Major.** Engine swaps (ESLint → Biome), `eslint` major version bumps,
  removal/rename of named exports, default-rule changes that introduce new
  errors in previously-clean code.

## License

MIT
