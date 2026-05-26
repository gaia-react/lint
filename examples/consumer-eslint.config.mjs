import gaiaLint from '../dist/index.js';
import {defineConfig} from 'eslint/config';

const lint = gaiaLint(); // pass {sourceDir: 'src'} (or any other path) for non-GAIA layouts

export default defineConfig([
  ...lint.ignores,
  ...lint.base,
  ...lint.react,
  ...lint.testing,
  ...lint.storybook,
  ...lint.playwright,
  ...lint.styleHygiene,
  ...lint.guardrails,
  ...lint.betterTailwind({entryPoint: './app/styles/tailwind.css'}),
  ...lint.prettier,
]);
