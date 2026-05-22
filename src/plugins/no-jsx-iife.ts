import type {ESLint, Rule} from 'eslint';

const noJsxIifeRule: Rule.RuleModule = {
  create: (context) => ({
    'JSXExpressionContainer > CallExpression > ArrowFunctionExpression.callee':
      (node: Rule.Node) => {
        context.report({messageId: 'noJsxIife', node});
      },
    'JSXExpressionContainer > CallExpression > FunctionExpression.callee': (
      node: Rule.Node,
    ) => {
      context.report({messageId: 'noJsxIife', node});
    },
  }),
  meta: {
    docs: {description: 'Disallow IIFEs in JSX expressions'},
    messages: {
      noJsxIife:
        'Do not use IIFEs in JSX. Use a computed variable before the return or extract a component instead.',
    },
    schema: [],
    type: 'problem',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'no-jsx-iife',
    version: '0.1.0',
  },
  rules: {
    'no-jsx-iife': noJsxIifeRule,
  },
};

export default plugin;
