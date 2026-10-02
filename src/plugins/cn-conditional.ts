import type {ESLint, Rule, Scope} from 'eslint';

/**
 * Holds one form for a conditional class passed to `cn` from the `cn` package:
 * an inline ternary with `undefined` as the empty branch. Object conditionals
 * and `&&` / `||` / `??` conditionals are reported.
 *
 * Only a callee that resolves to the named import `cn` from `'cn'` is checked
 * (aliases count; a local `cn` or a `cn` from another module is ignored).
 * Namespace imports (`import * as c from 'cn'; c.cn(...)`) are a deliberate
 * miss.
 */

const LOGICAL_OPERATORS = new Set(['&&', '||', '??']);

type CallNode = Parameters<NonNullable<Rule.NodeListener['CallExpression']>>[0];
type Argument = CallNode['arguments'][number];

const findVariable = (
  scope: Scope.Scope | null,
  name: string
): Scope.Variable | undefined => {
  let current = scope;
  while (current) {
    const variable = current.set.get(name);
    if (variable) return variable;
    current = current.upper;
  }
  return undefined;
};

const isCnImport = (variable: Scope.Variable | undefined): boolean =>
  variable !== undefined &&
  variable.defs.length === 1 &&
  variable.defs.every((definition) => {
    if (definition.type !== 'ImportBinding') return false;
    const specifier = definition.node;
    return (
      specifier.type === 'ImportSpecifier' &&
      specifier.imported.type === 'Identifier' &&
      specifier.imported.name === 'cn' &&
      definition.parent?.type === 'ImportDeclaration' &&
      definition.parent.source.value === 'cn'
    );
  });

const cnConditionalRule: Rule.RuleModule = {
  create: (context) => {
    const visit = (node: Argument | null | undefined): void => {
      if (!node) return;
      switch (node.type) {
        case 'ArrayExpression':
          node.elements.forEach((element) => visit(element));
          break;
        case 'ConditionalExpression':
          visit(node.consequent);
          visit(node.alternate);
          break;
        case 'LogicalExpression':
          if (LOGICAL_OPERATORS.has(node.operator)) {
            context.report({messageId: 'useTernary', node});
          }
          break;
        case 'ObjectExpression':
          context.report({messageId: 'useTernary', node});
          break;
        default:
          break;
      }
    };

    return {
      CallExpression: (node: CallNode) => {
        if (node.callee.type !== 'Identifier') return;
        const variable = findVariable(
          context.sourceCode.getScope(node),
          node.callee.name
        );
        if (!isCnImport(variable)) return;
        node.arguments.forEach((argument) => visit(argument));
      },
    };
  },
  meta: {
    docs: {
      description:
        'Require conditional classes passed to cn to be inline ternaries',
    },
    messages: {
      useTernary:
        "Write a conditional class as a ternary: `cond ? 'class' : undefined`. `cn` does not accept object or `&&`/`||`/`??` conditionals in GAIA.",
    },
    schema: [],
    type: 'problem',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'cn-conditional',
    version: '0.1.0',
  },
  rules: {
    'cn-conditional': cnConditionalRule,
  },
};

export default plugin;
