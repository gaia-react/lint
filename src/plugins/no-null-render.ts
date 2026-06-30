import type {ESLint, Rule} from 'eslint';

/**
 * Render nothing with `undefined`, not `null`, in render functions.
 *
 * Consistency convention only: `null` and `undefined` are behaviorally
 * identical to React's reconciler (both, plus `false`/`true`, are the same
 * empty slot) and equally cheap in V8. This standardizes on the newer of two
 * equivalent forms; it does NOT imply `null` is wrong or slow.
 *
 * Safety model: this rule autofixes under unsupervised `eslint --fix`. A
 * `return null` in a React Router loader/action/util MUST stay `null` (rewriting
 * it would change runtime behavior). So a `return null` is fixed ONLY when its
 * lexically-enclosing function is PROVABLY a render function (renders JSX in its
 * own scope). When render context is not provable, the rule does nothing: a
 * deliberate safe miss.
 */

type ReturnNode = Parameters<NonNullable<Rule.NodeListener['ReturnStatement']>>[0];

type RenderFrame = {candidates: ReturnNode[]; rendersJsx: boolean};

// JSX nodes are not part of @types/estree, so widen to `{type}` to compare.
const isJsxNode = (node: {type: string}): boolean =>
  node.type === 'JSXElement' || node.type === 'JSXFragment';

const noNullRenderRule: Rule.RuleModule = {
  create: (context) => {
    // Function-frame stack. One frame per function entered during traversal.
    const stack: RenderFrame[] = [];

    const enterFunction = (node: Rule.Node) => {
      const frame: RenderFrame = {candidates: [], rendersJsx: false};
      // An arrow with a JSX expression body renders JSX in its OWN frame.
      if (node.type === 'ArrowFunctionExpression' && isJsxNode(node.body)) {
        frame.rendersJsx = true;
      }
      stack.push(frame);
    };

    const exitFunction = () => {
      const frame = stack.pop();
      if (!frame || !frame.rendersJsx) {
        return; // Not a provable render frame: leave every candidate alone.
      }
      for (const candidate of frame.candidates) {
        const {argument} = candidate;
        if (!argument) {
          continue;
        }
        context.report({
          fix: (fixer) => fixer.replaceText(argument, 'undefined'),
          messageId: 'nullRender',
          node: candidate,
        });
      }
    };

    return {
      ArrowFunctionExpression: enterFunction,
      'ArrowFunctionExpression:exit': exitFunction,
      FunctionDeclaration: enterFunction,
      'FunctionDeclaration:exit': exitFunction,
      FunctionExpression: enterFunction,
      'FunctionExpression:exit': exitFunction,
      ReturnStatement: (node) => {
        const frame = stack[stack.length - 1];
        if (!frame) {
          return; // `return` outside any function: not our concern.
        }
        const {argument} = node;
        if (!argument) {
          return; // bare `return;`
        }
        if (isJsxNode(argument)) {
          // A `return <JSX>` proves THIS frame is a render function.
          frame.rendersJsx = true;
          return;
        }
        if (
          argument.type === 'Literal' &&
          argument.value === null &&
          argument.raw === 'null'
        ) {
          // A literal `return null;`: attribute to the current (top) frame.
          // (raw === 'null' excludes regex literals, whose `value` can be null.)
          frame.candidates.push(node);
        }
      },
    };
  },
  meta: {
    docs: {
      description:
        'Render nothing with `undefined`, not `null`, in render functions',
    },
    fixable: 'code',
    messages: {
      nullRender:
        'Render nothing with `undefined`, not `null`. GAIA standardizes on `undefined` for the empty render (both are identical to React; this is a consistency convention).',
    },
    schema: [],
    type: 'suggestion',
  },
};

const plugin: ESLint.Plugin = {
  meta: {
    name: 'no-null-render',
    version: '0.1.0',
  },
  rules: {
    'no-null-render': noNullRenderRule,
  },
};

export default plugin;
