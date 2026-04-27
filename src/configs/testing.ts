import vitest from '@vitest/eslint-plugin';
import jestDom from 'eslint-plugin-jest-dom';
import testingLibrary from 'eslint-plugin-testing-library';
import type {Linter} from 'eslint';

/**
 * Testing flat-config block.
 *
 * Ports `testHarnessConfig` + `testingLibraryConfig` from GAIA's
 * `eslint.config.mjs`. Wires up Vitest, jest-dom, and Testing Library
 * recommended rules across test/story/test-harness files.
 */
export const testing: Linter.Config[] = [
  {
    files: ['*.test.ts?(x)', '*.stories.ts?(x)', 'test/**/*.ts?(x)'],
    name: 'vitest',
    plugins: {
      'jest-dom': jestDom,
      vitest,
    },
    rules: {
      ...jestDom.configs['flat/recommended'].rules,
      ...vitest.configs.recommended.rules,
    },
  },
  {
    ...testingLibrary.configs['flat/react'],
    files: ['**/*.test.ts?(x)'],
    name: 'testing-library',
  },
];
