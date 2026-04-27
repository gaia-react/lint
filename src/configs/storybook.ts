import storybookPlugin from 'eslint-plugin-storybook';
import type {Linter} from 'eslint';

/**
 * Storybook flat-config block.
 *
 * Ports `storybookConfig` from GAIA's `eslint.config.mjs` — applies the
 * official `flat/recommended` config from `eslint-plugin-storybook`.
 */
export const storybook: Linter.Config[] = [
  ...(storybookPlugin.configs['flat/recommended'] as Linter.Config[]),
];
