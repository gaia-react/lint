export {base} from './configs/base.js';
export {react} from './configs/react.js';
export {styleHygiene} from './configs/style-hygiene.js';
export {guardrails} from './configs/guardrails.js';
export {testing} from './configs/testing.js';
export {storybook} from './configs/storybook.js';
export {playwright} from './configs/playwright.js';
export {prettier} from './configs/prettier.js';
export {
  betterTailwind,
  type GaiaLintBetterTailwindOptions,
} from './configs/better-tailwind.js';
export {
  ignores,
  type GaiaLintIgnoresOptions,
} from './configs/ignores.js';

import {base} from './configs/base.js';
import {react} from './configs/react.js';
import {styleHygiene} from './configs/style-hygiene.js';
import {guardrails} from './configs/guardrails.js';
import {testing} from './configs/testing.js';
import {storybook} from './configs/storybook.js';
import {playwright} from './configs/playwright.js';
import {prettier} from './configs/prettier.js';
import {betterTailwind} from './configs/better-tailwind.js';
import {ignores} from './configs/ignores.js';

const gaiaLint: {
  base: typeof base;
  react: typeof react;
  styleHygiene: typeof styleHygiene;
  guardrails: typeof guardrails;
  testing: typeof testing;
  storybook: typeof storybook;
  playwright: typeof playwright;
  prettier: typeof prettier;
  betterTailwind: typeof betterTailwind;
  ignores: typeof ignores;
} = {
  base,
  react,
  styleHygiene,
  guardrails,
  testing,
  storybook,
  playwright,
  prettier,
  betterTailwind,
  ignores,
};

export default gaiaLint;
