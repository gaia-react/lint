import type {ESLint, Rule} from 'eslint';

const noEnumRule: Rule.RuleModule = {
  create: (context) => ({
    TSEnumDeclaration: (node: Rule.Node) => {
      context.report({messageId: 'noEnum', node});
    },
  }),
  meta: {
    docs: {description: 'Disallow TypeScript enums'},
    messages: {
      noEnum:
        'Do not use TypeScript enums. Use an object with `as const` instead.',
    },
    schema: [],
    type: 'problem',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'no-enum',
    version: '0.1.0',
  },
  rules: {
    'no-enum': noEnumRule,
  },
};

export default plugin;
