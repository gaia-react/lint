import type {Config} from 'prettier';

const config: Config = {
  bracketSpacing: false,
  experimentalTernaries: true,
  plugins: ['prettier-plugin-tailwindcss'],
  singleQuote: true,
  tabWidth: 2,
  tailwindFunctions: ['twJoin', 'twMerge'],
  trailingComma: 'es5',
};

export default config;
