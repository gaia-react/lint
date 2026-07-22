---
"@gaia-react/lint": major
---

React Router relaxations move out of `react` into a new opt-in `reactRouter` block.

`react` shipped a block scoped to `**/routes/**/*.tsx` that turned `no-empty-pattern` off. That glob is not unique to React Router: TanStack Router uses a `routes/` directory too, so a project on any other file-based router had the rule silently disabled across its whole route tree, with nothing in the composed config explaining why.

The relaxation now ships as its own block. Spread it after `react` if you run React Router in framework mode:

```js
...lint.react,
...lint.reactRouter,
```

**Breaking for React Router consumers.** Without that line, `no-empty-pattern` reports every route module that destructures nothing from its typed props (`({}: Route.ComponentProps)`). Adding the spread restores the previous behavior exactly; there is no other migration step. A project that never writes that shape sees no new errors either way, so the upgrade may well be a no-op in practice.

Projects on another router should omit it and keep the rule enabled. They will most likely also want to ignore their generated route tree:

```js
...lint.ignores({extra: ['**/routeTree.gen.ts']}),
```

The `/.react-router/**` glob stays in the `ignores` defaults. It names a directory that only exists in a React Router project, so it costs other projects nothing, while moving it would break React Router consumers who miss the new spread.

A new suite asks ESLint what the composed config resolves to on both sides of the opt-in, so a future change that folds the block back into `react`, or widens its glob, fails a test instead of quietly relaxing a rule.

Two dead config entries are removed in the same pass. Neither changes any effective rule:

- `react/display-name` was set to `off` in the route block, but `airbnb/config/react` already sets it to `off` for every file.
- The `typescript/only-throw-error` block disabled `@typescript-eslint/only-throw-error` for `hooks/`, `routes/`, and `sessions.server/`, but the `typescript/config` block already disables that rule globally for `**/*.ts?(x)`.
