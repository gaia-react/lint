import type {Linter} from 'eslint';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import sonarjs from 'eslint-plugin-sonarjs';
import noEnumPlugin from '../plugins/no-enum.js';
import noSwitchPlugin from '../plugins/no-switch.js';

const sonarConfig: Linter.Config[] = [
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
    files: ['app/languages/**/*.ts', 'eslint.config.mjs'],
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

const noSwitchConfig: Linter.Config[] = [
  {
    files: ['**/*.ts?(x)', '**/*.js?(x)'],
    name: 'no-switch',
    plugins: {'no-switch': noSwitchPlugin},
    rules: {'no-switch/no-switch': 'error'},
  },
];

const noRelativeImportPathsConfig: Linter.Config[] = [
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
          rootDir: 'app',
        },
      ],
    },
  },
];

export const guardrails: Linter.Config[] = [
  ...sonarConfig,
  ...noEnumConfig,
  ...noSwitchConfig,
  ...noRelativeImportPathsConfig,
];
