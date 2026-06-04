import type {Linter} from 'eslint';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import sonarjs from 'eslint-plugin-sonarjs';
import noEnumPlugin from '../plugins/no-enum.js';
import noJsxIifePlugin from '../plugins/no-jsx-iife.js';
import noSwitchPlugin from '../plugins/no-switch.js';

const buildSonarConfig = (sourceDir: string): Linter.Config[] => [
  sonarjs.configs!.recommended as Linter.Config,
  {
    name: 'sonarjs',
    rules: {
      'sonarjs/cognitive-complexity': 'error',
      'sonarjs/fixme-tag': 'off',
      'sonarjs/no-commented-code': 'off',
      'sonarjs/no-nested-conditional': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/no-selector-parameter': 'off',
      'sonarjs/regex-complexity': 'off',
      'sonarjs/todo-tag': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    name: 'sonarjs/react-files',
    rules: {
      'sonarjs/cognitive-complexity': 'off',
      'sonarjs/function-return-type': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'sonarjs/test-files',
    rules: {
      'sonarjs/no-duplicate-string': 'off',
      'sonarjs/no-identical-functions': 'off',
    },
  },
  {
    files: [`${sourceDir}/languages/**/*.ts`, 'eslint.config.mjs'],
    name: 'sonarjs/credential-checks',
    rules: {
      'sonarjs/no-hardcoded-credentials': 'off',
      'sonarjs/no-hardcoded-passwords': 'off',
    },
  },
];

const noEnumConfig: Linter.Config[] = [
  {
    files: ['**/*.ts?(x)'],
    name: 'no-enum',
    plugins: {'no-enum': noEnumPlugin},
    rules: {
      'no-enum/no-enum': 'error',
    },
  },
];

const noJsxIifeConfig: Linter.Config[] = [
  {
    files: ['**/*.tsx', '**/*.jsx'],
    name: 'no-jsx-iife',
    plugins: {'no-jsx-iife': noJsxIifePlugin},
    rules: {'no-jsx-iife/no-jsx-iife': 'error'},
  },
];

const noSwitchConfig: Linter.Config[] = [
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    name: 'no-switch',
    plugins: {'no-switch': noSwitchPlugin},
    rules: {'no-switch/no-switch': 'error'},
  },
];

/**
 * Architecture-boundary enforcement for GAIA's canonical `app/` layout.
 *
 * Imports may only flow from a higher layer to a lower one:
 *
 *   routes -> pages -> components -> { hooks, state } -> services -> utils -> types
 *
 * `types/` is a pure leaf importable by everyone. Each zone names a lower
 * layer as `target` and the higher layers it must not import as `from`, so a
 * lower-importing-higher edge (the wrong direction) is reported. `routes`
 * appears in every `from` set, which encodes "nothing may import a route".
 *
 * Zone `target`/`from` paths resolve against `process.cwd()` (the consuming
 * project's root where eslint runs), not this package's location in
 * node_modules, so `./${sourceDir}/...` correctly points at the consumer's
 * source tree. `import-x@4.16.2` accepts `from`/`target` as string arrays,
 * which collapses the higher->lower pairs into one zone per target layer.
 *
 * `app/middleware`, `app/sessions.server`, `app/assets`, `app/languages`, and
 * `app/styles` are intentionally left unconstrained (server/asset dirs).
 */
const buildNoRestrictedPathsConfig = (
  sourceDir: string,
): Linter.Config[] => {
  const dir = (layer: string): string => `./${sourceDir}/${layer}`;

  return [
    {
      files: [`${sourceDir}/**/!(*.test|*.stories).ts?(x)`],
      name: 'import-x/architecture-boundaries',
      rules: {
        'import-x/no-restricted-paths': [
          'error',
          {
            zones: [
              {
                from: [dir('routes')],
                message:
                  'Pages may only be imported by routes; a page must not import a route (import direction is routes -> pages -> components).',
                target: dir('pages'),
              },
              {
                from: [dir('routes'), dir('pages')],
                message:
                  'Reusable components must not depend on page- or route-level code (import direction is routes -> pages -> components).',
                target: dir('components'),
              },
              {
                from: [dir('routes'), dir('pages'), dir('components')],
                message:
                  'Hooks and state sit below the UI tree; they must not import components, pages, or routes.',
                target: [dir('hooks'), dir('state')],
              },
              {
                from: [
                  dir('routes'),
                  dir('pages'),
                  dir('components'),
                  dir('hooks'),
                  dir('state'),
                ],
                message:
                  'The service/data layer sits below the UI and orchestration layers; it must not import components, pages, routes, hooks, or state.',
                target: dir('services'),
              },
              {
                from: [
                  dir('routes'),
                  dir('pages'),
                  dir('components'),
                  dir('hooks'),
                  dir('state'),
                  dir('services'),
                ],
                message:
                  'Utils are near-leaves; they may import only types and other utils.',
                target: dir('utils'),
              },
              {
                from: [
                  dir('routes'),
                  dir('pages'),
                  dir('components'),
                  dir('hooks'),
                  dir('state'),
                  dir('services'),
                  dir('utils'),
                ],
                message:
                  'Types are a pure leaf; they must not import any other app layer.',
                target: dir('types'),
              },
            ],
          },
        ],
      },
    },
  ];
};

const buildNoRelativeImportPathsConfig = (
  sourceDir: string,
): Linter.Config[] => [
  {
    name: 'no-relative-import-paths',
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
    },
    rules: {
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowedDepth: 2,
          allowSameFolder: true,
          prefix: '~',
          rootDir: sourceDir,
        },
      ],
    },
  },
];

export const buildGuardrails = (sourceDir: string): Linter.Config[] => [
  ...buildSonarConfig(sourceDir),
  ...noEnumConfig,
  ...noJsxIifeConfig,
  ...noSwitchConfig,
  ...buildNoRestrictedPathsConfig(sourceDir),
  ...buildNoRelativeImportPathsConfig(sourceDir),
];
