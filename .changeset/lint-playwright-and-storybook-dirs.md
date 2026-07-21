---
"@gaia-react/lint": minor
---

Stop ignoring `.playwright` and `.storybook` by default, so the `playwright` and `storybook` blocks actually run.

Both directories were bare entries in the `ignores` defaults. A config object carrying only `ignores` is a GLOBAL ignore in flat config, and a global ignore beats any later block's `files`, so the two blocks that scope themselves to those directories were shadowed by the defaults they shipped alongside. `playwright` scopes itself to `.playwright/**/*.ts?(x)` and never matched a file; `storybook` kept its `*.stories.*` rules (those live outside the directory) but its `.storybook/main.*` rules never ran. The composed config read as though the directories were covered, and `pnpm lint` reported zero problems for code nothing had checked.

The defaults now name only generated output, non-source assets, and tool-owned script directories. A new `ignores` suite asks ESLint which paths survive the defaults, so a future directory-level entry that shadows a scoped block fails a test instead of shipping.

Consumers will see new lint errors on upgrade, in e2e specs and their helpers, in Storybook config and decorators, and in anything else living under those two directories. Most are auto-fixable with `--fix`. Real findings surface too: `playwright/expect-expect`, `playwright/no-conditional-in-test`, and `playwright/no-skipped-test` have been configured but inert. To keep a directory exempt, pass it back explicitly:

```js
...lint.ignores({extra: ['.playwright', '.storybook']}),
```
