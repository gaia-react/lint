import type {ESLint, Rule} from 'eslint';

const noSwitchRule: Rule.RuleModule = {
  create: (context) => ({
    SwitchStatement: (node: Rule.Node) => {
      context.report({messageId: 'noSwitch', node});
    },
  }),
  meta: {
    docs: {description: 'Disallow switch statements'},
    messages: {
      noSwitch:
        'Do not use switch statements. Use an object map or if/else instead.',
    },
    schema: [],
    type: 'problem',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'no-switch',
    version: '0.1.0',
  },
  rules: {
    'no-switch': noSwitchRule,
  },
};

export default plugin;
