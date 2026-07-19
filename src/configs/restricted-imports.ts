/**
 * Shared `no-restricted-imports` path bans.
 *
 * Referenced by BOTH the global base config and the testing config. ESLint
 * flat config replaces a rule's options WHOLESALE across config objects (it
 * does not merge them), so a later block that re-declares
 * `no-restricted-imports` — testing.ts scopes one to test/story files — would
 * otherwise DROP these bans on the files it matches. Both call sites spread
 * this same const so the ban holds everywhere and stays DRY.
 *
 * Uses `paths` (exact specifier match), not `patterns` (glob match): only the
 * bare `@conform-to/zod` specifier is banned, while the distinct
 * `@conform-to/zod/v4` specifier stays allowed. A `patterns` entry keyed on
 * `@conform-to/zod` would wrongly also catch the `/v4` subpath.
 */
export const RESTRICTED_IMPORT_PATHS = [
  {
    message:
      "Import from '@conform-to/zod/v4'. The bare '@conform-to/zod' specifier targets Zod v3 and throws at runtime, uncaught by typecheck, lint, and build.",
    name: '@conform-to/zod',
  },
];
