import {rules as prettierConfigRules} from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import type {Linter} from 'eslint';

/**
 * Prettier flat-config block.
 *
 * Ports `prettierConfig` from GAIA's `eslint.config.mjs`. Layers
 * `eslint-config-prettier`'s rule disablers, then re-enables a few
 * `@stylistic/*` rules GAIA wants to keep (padding lines, single quotes),
 * and finally turns on the `prettier/prettier` rule itself.
 */
export const prettier: Linter.Config[] = [
  {
    name: 'prettier/plugin/config',
    plugins: {prettier: prettierPlugin},
  },
  {
    name: 'prettier/config',
    rules: {
      ...prettierConfigRules,
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          next: ['block-like', 'export', 'return', 'throw'],
          prev: '*',
        },
      ],
      '@stylistic/quotes': [
        'error',
        'single',
        {
          allowTemplateLiterals: 'avoidEscape',
          avoidEscape: true,
        },
      ],
      '@stylistic/spaced-comment': 'off',
      'prettier/prettier': ['error', {endOfLine: 'auto'}],
    },
  },
];
