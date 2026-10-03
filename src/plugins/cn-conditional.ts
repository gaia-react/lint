import type {ESLint, Rule, Scope} from 'eslint';

/**
 * Holds one form for a conditional class passed to `cn` from the `cn` package:
 * `cond && 'class'`. Object arguments and ternaries with an empty branch
 * (`undefined`, `null`, `false`, `''`, or an empty template) are reported. A
 * ternary with two non-empty branches (`c ? 'a' : 'b'`) is allowed.
 *
 * Only a callee that resolves to the named import `cn` from `'cn'` is checked
 * (aliases count; a local `cn` or a `cn` from another module is ignored).
 * Namespace imports (`import * as c from 'cn'; c.cn(...)`) are a deliberate
 * miss.
 */

type CallNode = Parameters<NonNullable<Rule.NodeListener['CallExpression']>>[0];
type Argument = CallNode['arguments'][number];
type Visited = Argument | null | undefined;

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

const isEmptyBranch = (node: Visited): boolean => {
  if (!node) return false;
  switch (node.type) {
    case 'Identifier':
      return node.name === 'undefined';
    case 'Literal':
      return (
        node.value === null || node.value === false || node.value === ''
      );
    case 'TemplateLiteral':
      return (
        node.expressions.length === 0 &&
        node.quasis.every((quasi) => quasi.value.cooked === '')
      );
    default:
      return false;
  }
};

const cnConditionalRule: Rule.RuleModule = {
  create: (context) => {
    const visit = (node: Visited): void => {
      if (!node) return;
      switch (node.type) {
        case 'ArrayExpression':
          node.elements.forEach((element) => visit(element));
          break;
        case 'ConditionalExpression':
          if (isEmptyBranch(node.consequent) || isEmptyBranch(node.alternate)) {
            context.report({messageId: 'useLogical', node});
          } else {
            visit(node.consequent);
            visit(node.alternate);
          }
          break;
        case 'LogicalExpression':
          if (node.operator === '&&') {
            visit(node.right);
          } else {
            visit(node.left);
            visit(node.right);
          }
          break;
        case 'ObjectExpression':
          context.report({messageId: 'useLogical', node});
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
        "Require conditional classes passed to cn to be written as `cond && 'class'`",
    },
    messages: {
      useLogical:
        "Write a conditional class as `cond && 'class'` (or `!cond && 'class'`). `cn` does not accept object conditionals or a ternary with an empty branch in GAIA.",
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
