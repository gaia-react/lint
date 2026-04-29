# @gaia-react/lint

## 1.1.1

### Patch Changes

- [#6](https://github.com/gaia-react/lint/pull/6) [`efebb80`](https://github.com/gaia-react/lint/commit/efebb803e690076133ab1c0c9f9ab5adb8ee9cd4) Thanks [@stevensacks](https://github.com/stevensacks)! - Close `prefer-arrow-functions` upstream gap for `export default function NamedFn(){}` via `no-restricted-syntax` selector.

  The `eslint-plugin-prefer-arrow-functions` plugin has a hardcoded exemption (`guard.js:hasNameAndIsExportedAsDefaultExport`) that silently passes named default-exported declarations regardless of `allowNamedFunctions` setting. This release adds a `no-restricted-syntax` rule with selector `ExportDefaultDeclaration > FunctionDeclaration` to flag the pattern. Convert to `const Name = () => {}; export default Name;` instead. Ignored on `**/*.d.ts` since ambient declarations have no body to convert.

## 1.1.0

### Minor Changes

- [`ebad2d3`](https://github.com/gaia-react/lint/commit/ebad2d32c55656ea7a29bf764eaf536db4ccef81) Thanks [@stevensacks](https://github.com/stevensacks)! - Add Prettier and Stylelint config subpath exports.
  - `@gaia-react/lint/prettier` — Prettier engine config (singleQuote, no bracket spacing, ES5 trailing commas, experimental ternaries, Tailwind class-sorting via `prettier-plugin-tailwindcss` for `twJoin`/`twMerge`).
  - `@gaia-react/lint/stylelint` — Stylelint config extending `stylelint-config-standard` + `stylelint-config-clean-order` + `stylelint-config-tailwindcss`, with `stylelint-order` plugin and GAIA-specific overrides for CSS modules.

  Consumer usage:

  ```js
  // prettier.config.mjs
  export {default} from '@gaia-react/lint/prettier';

  // stylelint.config.mjs
  export {default} from '@gaia-react/lint/stylelint';
  ```

  `stylelint` joins `eslint`/`prettier`/`typescript` as a peer dependency (optional; only required if you import the stylelint subpath).
