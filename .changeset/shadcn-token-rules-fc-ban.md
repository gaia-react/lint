---
"@gaia-react/lint": major
---

Breaking: importing `FC` or `FunctionComponent` from `react` is now an error everywhere, including test and story files. Type props inline instead: `type ButtonProps = {...}; const Button = ({...}: ButtonProps) => ...`.

Added: the opt-in `shadcn()` factory bundles `@shadcn/lint` (exact-pinned) so role tokens are the only color vocabulary. It sets `shadcn/no-raw-colors`, `shadcn/require-static-classes`, `shadcn/no-arbitrary-values` and `shadcn/no-inline-styles` to error, `shadcn/no-restyle` to error with `allow: ['layout']`, and `shadcn/no-unknown-classes` off in favor of better-tailwindcss's `no-unknown-classes`. Its vendored-ui block turns Prettier and the house-style rules off for `components/ui/*.tsx` (registry output stays byte-identical to `shadcn add`) while `shadcn/no-raw-colors`, `react-hooks/*` and the other correctness rules stay on, and `components/ui/tests/**` stays fully linted. Spread `...lint.shadcn({ui: '~/components/ui'})` as the last entry, after the full GAIA composition and `...lint.prettier`.

The `eslint` peer floor rises from `^9.0.0` to `^9.30.0`, which `@shadcn/lint` requires. `@shadcn/lint` also pulls a dev-only copy of the `cn` package.
