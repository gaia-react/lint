import type {Linter} from 'eslint';
import canonical from 'eslint-plugin-canonical';
import checkFile from 'eslint-plugin-check-file';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import unusedImports from 'eslint-plugin-unused-imports';

const canonicalConfig: Linter.Config[] = [
  canonical.configs['flat/recommended'] as Linter.Config,
  {
    name: 'canonical',
    rules: {
      'canonical/destructuring-property-newline': 'off',
      'canonical/filename-match-exported': 'error',
      'canonical/id-match': 'off',
      'canonical/import-specifier-newline': 'off',
    },
  },
  {
    files: ['**/*.tsx', '**/hooks/*.ts?(x)'],
    name: 'canonical/sort-react-dependencies',
    rules: {
      'canonical/sort-react-dependencies': 'error',
    },
  },
  {
    files: [
      'app/root.tsx',
      'app/entry.server.tsx',
      'app/**/tests/*',
      'test/**/*.ts?(x)',
      '**/*.stories.tsx',
      '**/routes/**/*.tsx',
      '**/hooks/*.ts?(x)',
      '.storybook/**/*.ts?(x)',
      '.playwright/**/*.ts?(x)',
    ],
    name: 'canonical/filename-match-exported-disabled',
    rules: {
      'canonical/filename-match-exported': 'off',
    },
  },
];

const perfectionistConfig: Linter.Config[] = [
  perfectionist.configs['recommended-natural'] as Linter.Config,
  {
    name: 'perfectionist',
    rules: {
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: '^react$',
              groupName: 'react-type',
              selector: 'type',
            },
            {
              elementNamePattern: '^react$',
              groupName: 'react',
            },
            {
              elementNamePattern: '^react-.+',
              groupName: 'react-other-type',
              selector: 'type',
            },
            {
              elementNamePattern: '^react-.+',
              groupName: 'react-other',
            },
          ],
          groups: [
            'react-type',
            'react',
            'react-other-type',
            'react-other',
            ['type-external', 'external'],
            ['type-builtin', 'builtin'],
            ['type-internal', 'internal'],
            ['type-parent', 'parent'],
            ['type-sibling', 'sibling'],
            ['type-index', 'index'],
            'unknown',
            'style',
            'side-effect',
            'side-effect-style',
          ],
          newlinesBetween: 0,
          type: 'natural',
        },
      ],
      'perfectionist/sort-jsx-props': [
        'error',
        {
          customGroups: [
            {
              elementNamePattern: ['^key$', '^ref$'],
              groupName: 'reserved',
            },
          ],
          groups: ['reserved'],
          type: 'natural',
        },
      ],
    },
  },
];

const unicornConfig: Linter.Config[] = [
  unicorn.configs.recommended as Linter.Config,
  {
    name: 'unicorn',
    rules: {
      'unicorn/consistent-destructuring': 'error',
      'unicorn/consistent-template-literal-escape': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/new-for-builtins': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-array-reduce': 'off',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-export-from': 'off',
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-set-has': 'off',
      'unicorn/prefer-switch': 'off',
      'unicorn/prefer-ternary': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          ignore: [
            'acc',
            'ctx',
            'e2e',
            'env',
            'obj',
            'prev',
            'req',
            'res',
            /args/i,
            /fn/i,
            /param/i,
            /params/i,
            /props/i,
            /ref/i,
            /src/i,
            /utils/i,
          ],
        },
      ],
      'unicorn/text-encoding-identifier-case': 'off',
    },
  },
  {
    files: ['./*.ts'],
    name: 'unicorn/root-ts-files',
    rules: {
      'unicorn/prefer-module': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
];

const unusedImportsConfig: Linter.Config[] = [
  {
    name: 'unused-imports',
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'sonarjs/no-unused-vars': 'off',
      'sonarjs/unused-import': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    name: 'unused-imports/ts-definition-files',
    rules: {
      'unused-imports/no-unused-vars': 'off',
    },
  },
];

const checkFileConfig: Linter.Config[] = [
  {
    plugins: {
      'check-file': checkFile,
    },
  },
  {
    files: ['app/**/*'],
    name: 'check-file',
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          // React hook files must be camelCase (to match the hook name)
          '**/hooks/*.{ts,tsx}': 'CAMEL_CASE',
          'app/state/*.tsx': 'KEBAB_CASE',
          // React component files must be named index.tsx
          'app/{components,pages}/**/!(assets|hooks|state|tests|utils)/*.tsx':
            'index+()',
          // Generally, non-component files must be named kebab-case
          'app/{components,pages}/**/!(hooks)/*.ts': 'KEBAB_CASE',
          // Non-component files inside specific components folders must be kebab-case
          'app/{components,pages}/**/(assets|state|tests|utils)/*.{ts,tsx}':
            'KEBAB_CASE',
          'test/**/*.ts?(x)': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
      'check-file/folder-match-with-fex': [
        'error',
        {
          // require stories and test files to be inside tests folders
          '*.(stories|test).{ts,tsx}': 'app/**/tests/',
        },
      ],
      'check-file/folder-naming-convention': [
        'error',
        {
          // enforce PascalCase component folders, and allow assets, hooks, tests, and utils subfolders
          'app/components/**/':
            '(assets|hooks|state|tests|utils|[A-Z][a-zA-Z0-9]*)',
        },
      ],
    },
  },
  {
    files: ['test/**/*.*'],
    name: 'check-file/test-files',
    rules: {
      'check-file/filename-naming-convention': [
        'error',
        {
          'test/**/*.ts?(x)': 'KEBAB_CASE',
        },
        {
          ignoreMiddleExtensions: true,
        },
      ],
    },
  },
];

export const styleHygiene: Linter.Config[] = [
  ...canonicalConfig,
  ...perfectionistConfig,
  ...unicornConfig,
  ...unusedImportsConfig,
  ...checkFileConfig,
];
