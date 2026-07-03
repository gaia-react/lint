import type {ESLint, Rule} from 'eslint';

const noZodEnumRule: Rule.RuleModule = {
  create: (context) => ({
    'CallExpression > MemberExpression.callee[object.name="z"][property.name="enum"]':
      (node: Rule.Node) => {
        context.report({messageId: 'noZodEnum', node});
      },
  }),
  meta: {
    docs: {description: 'Disallow z.enum(); use z.literal([...]) instead'},
    messages: {
      noZodEnum:
        'Do not use z.enum(). Use z.literal([...]) for string unions (sort values alphanumerically).',
    },
    schema: [],
    type: 'problem',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'no-zod-enum',
    version: '0.1.0',
  },
  rules: {
    'no-zod-enum': noZodEnumRule,
  },
};

export default plugin;
