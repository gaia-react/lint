import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  {ignores: ['dist/**', 'examples/**']},
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {languageOptions: {ecmaVersion: 2024, sourceType: 'module'}},
];
