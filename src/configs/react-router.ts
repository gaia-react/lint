import type {Linter} from 'eslint';

/**
 * React Router flat-config block. Optional, and required only for projects
 * running React Router in framework mode.
 *
 * This block is SUBTRACTIVE: it relaxes a rule the rest of the bundle turns
 * on, rather than adding rules the way `storybook` and `playwright` do. That
 * is why it ships separately instead of living inside `react`. Its glob,
 * `**\/routes/**\/*.tsx`, is not unique to React Router (TanStack Router uses
 * a `routes/` directory too), so folding it into `react` would silently
 * weaken lint for every file-based router that isn't React Router.
 *
 * Spread it after `react`:
 *
 *   ...lint.react,
 *   ...lint.reactRouter,
 *
 * `no-empty-pattern` is off because a React Router route module destructures
 * nothing from its typed props (`({}: Route.ComponentProps)`), which the rule
 * reads as an empty pattern. TanStack Router names its component
 * (`createFileRoute(...)({component: Named})`) and never produces that shape,
 * so a TanStack project wants the rule left on.
 */
export const reactRouter: Linter.Config[] = [
  {
    files: ['**/routes/**/*.tsx'],
    name: 'react-router/routes',
    rules: {
      'no-empty-pattern': 'off',
    },
  },
];
