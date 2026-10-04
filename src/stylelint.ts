import type {Config} from 'stylelint';

const config: Config = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-clean-order',
    'stylelint-config-tailwindcss',
  ],
  ignoreFiles: ['public/build/**/*.css'],
  overrides: [
    {
      files: ['**/*.module.css'],
      rules: {
        'selector-class-pattern': '^[a-z][a-zA-Z0-9]+$',
      },
    },
  ],
  plugins: ['stylelint-order'],
  rules: {
    'at-rule-no-deprecated': null,
    // stylelint-config-standard validates at-rule preludes as CSS; Tailwind's
    // @apply takes utility class names, which never parse as a valid prelude
    'at-rule-prelude-no-invalid': [true, {ignoreAtRules: ['apply']}],
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global', 'local'],
      },
    ],
  },
};

export default config;
