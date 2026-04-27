import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import js from '@eslint/js';
import {configs, plugins, rules} from 'eslint-config-airbnb-extended';
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions';
import lodashUnderscore from 'eslint-plugin-you-dont-need-lodash-underscore';
import type {ESLint, Linter} from 'eslint';

const jsConfig: Linter.Config[] = [
  // ESLint recommended config
  {
    name: 'js/config',
    ...js.configs.recommended,
  },
  // Stylistic plugin
  plugins.stylistic,
  // Import X plugin
  plugins.importX,
  // Airbnb base recommended config
  ...configs.base.recommended,
  // Strict import rules
  rules.base.importsStrict,
];

const jsCustomConfig: Linter.Config[] = [
  {
    name: 'js-custom',
    rules: {
      'consistent-return': 'off',
      curly: ['error', 'all'],
      'max-params': 'error',
      'no-param-reassign': 'off', // handled by sonarjs
      'no-undef': 'off',
      'no-unused-vars': 'off', // handled by sonarjs
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'test-files/all',
    rules: {
      'guard-for-in': 'off',
      'max-params': 'off',
      'no-await-in-loop': 'off',
      'no-plusplus': 'off',
      'no-restricted-syntax': 'off',
    },
  },
  {
    files: ['.playwright/**/*.ts?(x)'],
    name: 'playwright/all',
    rules: {
      'no-await-in-loop': 'off',
      'no-restricted-syntax': 'off',
    },
  },
];

const typescriptConfig: Linter.Config[] = [
  // TypeScript ESLint plugin
  plugins.typescriptEslint,
  // Airbnb base TypeScript config
  ...configs.base.typescript,
  // Strict TypeScript rules
  rules.typescript.typescriptEslintStrict,
  rules.typescript.stylistic,
  // Airbnb React TypeScript config
  ...configs.react.typescript,
  {
    files: ['./*.ts'],
    name: 'root-ts-files',
    rules: {
      'global-require': 'off',
      'no-void': 'off',
    },
  },
  {
    files: ['**/*.ts?(x)'],
    name: 'no-void',
    rules: {
      'no-void': ['error', {allowAsStatement: true}],
    },
  },
];

const tsEslintConfig: Linter.Config[] = [
  {
    files: ['**/*.ts?(x)'],
    name: 'typescript/config',
    rules: {
      '@typescript-eslint/array-type': ['error', {default: 'array'}],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        {ignoreArrowShorthand: true},
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {ignoreIIFE: true, ignoreVoid: true},
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {checksVoidReturn: false},
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-promise-reject-errors': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {allowBoolean: true, allowNumber: true},
      ],
      '@typescript-eslint/return-await': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
  {
    files: ['app/hooks/**/*', 'app/routes/**/*', 'app/sessions.server/**/*'],
    name: 'typescript/only-throw-error',
    rules: {
      '@typescript-eslint/only-throw-error': 'off',
    },
  },
  {
    files: ['app/utils/**', 'app/services/**', 'app/hooks/**'],
    name: 'typescript/explicit-return-types',
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'error',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'typescript/test-files',
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    name: 'typescript/test-config',
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      'no-plusplus': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'typescript/type-definitions',
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/method-signature-style': 'error',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
];

const importXConfig: Linter.Config[] = [
  {
    name: 'import-x-all-files',
    rules: {
      'import-x/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import-x/extensions': 'off',
      'import-x/no-anonymous-default-export': [
        'error',
        {
          allowArray: true,
          allowLiteral: true,
          allowObject: true,
        },
      ],
      'import-x/no-namespace': 'off',
      'import-x/no-rename-default': 'off',
      'import-x/no-useless-path-segments': 'off',
      'import-x/order': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['./*.ts'],
    name: 'import-x/root-ts-files',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'error',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.test.ts?(x)', '**/*.stories.ts?(x)'],
    name: 'import-x/test-files',
    rules: {
      'import-x/extensions': 'off',
      'import-x/no-extraneous-dependencies': 'off',
    },
  },
  {
    files: ['app/**/!(*.test|*.stories).ts?(x)'],
    name: 'import-x/app-test-files',
    rules: {
      'import-x/no-unresolved': 'error',
    },
  },
  {
    files: ['app/**/hooks/*.ts?(x)'],
    name: 'import-x/hooks',
    rules: {
      'import-x/no-default-export': 'error',
    },
  },
  {
    files: ['test/**/*.ts?(x)'],
    name: 'import-x/test-config-files',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/prefer-default-export': 'off',
    },
  },
  {
    files: ['.storybook/**/*.ts?(x)', '.playwright/**/*.ts?(x)'],
    name: 'import-x/storybook-playwright',
    rules: {
      'import-x/no-extraneous-dependencies': 'off',
      'import-x/no-unresolved': 'off',
    },
  },
];

const eslintCommentsConfig: Linter.Config[] = [
  {
    name: 'eslint-comments',
    plugins: {
      'eslint-comments': eslintComments,
    },
    rules: {
      'eslint-comments/disable-enable-pair': 'off',
      'eslint-comments/no-unused-disable': 'error',
    },
  },
];

const preferArrowFunctionsConfig: Linter.Config[] = [
  {
    name: 'prefer-arrow',
    plugins: {
      'prefer-arrow-functions': preferArrowFunctions as unknown as ESLint.Plugin,
    },
    rules: {
      'prefer-arrow-functions/prefer-arrow-functions': 'error',
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'ts-definition-files/prefer-arrow-off',
    rules: {
      'prefer-arrow-functions/prefer-arrow-functions': 'off',
    },
  },
];

const lodashUnderscoreConfig: Linter.Config[] = [
  {
    name: 'you-dont-need-lodash-underscore',
    plugins: {
      'you-dont-need-lodash-underscore':
        lodashUnderscore as unknown as ESLint.Plugin,
    },
    rules: {
      ...(lodashUnderscore.configs.compatible.rules as Linter.RulesRecord),
    },
  },
];

export const base: Linter.Config[] = [
  ...jsConfig,
  ...jsCustomConfig,
  ...typescriptConfig,
  ...tsEslintConfig,
  ...importXConfig,
  ...eslintCommentsConfig,
  ...preferArrowFunctionsConfig,
  ...lodashUnderscoreConfig,
];
