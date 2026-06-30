/**
 * RuleTester suite for the `no-null-render` rule.
 *
 * Fail-safe (VALID, leave-alone) cases are authored FIRST: the rule never
 * mutates a `return null` it cannot prove is a render. A false positive under
 * `--fix` would be a runtime bug, not noise.
 *
 * Plain JSX parses under default espree with `ecmaFeatures.jsx`: no TS parser
 * needed, since the rule only inspects JSX / Return / Literal nodes, which
 * espree emits identically to the TS parser.
 */
import {RuleTester} from 'eslint';
import {describe, it} from 'vitest';
import noNullRenderPlugin from './no-null-render.js';

// Route RuleTester's case registration through vitest for per-case reporting.
RuleTester.describe = describe;
RuleTester.it = it;

const noNullRenderRule = noNullRenderPlugin.rules!['no-null-render'];

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    parserOptions: {ecmaFeatures: {jsx: true}},
    sourceType: 'module',
  },
});

ruleTester.run('no-null-render', noNullRenderRule, {
  // --- VALID: must NOT be touched (fail-safe, authored first) ---
  valid: [
    // 1. React Router loader returning null: no JSX in frame, untouched.
    //    This is the invariant a mis-fix would break at runtime.
    'export const loader = () => { if (x) return null; return data; };',
    // 2. Plain util (no JSX anywhere) returning null, untouched.
    'const f = () => { return null; };',
    // 3. Component that returns ONLY null, no JSX anywhere, untouched
    //    (deliberate safe miss; render context not provable).
    'const Empty = () => { return null; };',
    // 4. A `: null` ternary arm in JSX, untouched (out of scope; owned by the
    //    report-only no-restricted-syntax selectors in base.ts).
    'const C = () => <div>{x ? <A/> : null}</div>;',
    // 5. Nested non-render callback inside a render component: the inner
    //    `return null` is in a non-render frame, so it is untouched; the outer
    //    frame renders JSX but has no `return null` of its own.
    'const C = () => { arr.forEach(() => { return null; }); return <div/>; };',
  ],

  // --- INVALID: must be fixed to `undefined` (report + pinned output) ---
  invalid: [
    // 6. Component returning JSX in one branch, null in another.
    {
      code: 'const C = () => { if (x) return <div/>; return null; };',
      errors: [{messageId: 'nullRender'}],
      output: 'const C = () => { if (x) return <div/>; return undefined; };',
    },
    // 7. .map block-body callback returning JSX in one branch and null in
    //    another: the callback frame renders JSX, so its null is fixed.
    {
      code: 'items.map((i) => { if (i.hide) return null; return <li key={i.id}/>; });',
      errors: [{messageId: 'nullRender'}],
      output:
        'items.map((i) => { if (i.hide) return undefined; return <li key={i.id}/>; });',
    },
    // 8. Component typed `(): ReactElement | null` in TS. Written as plain JSX
    //    here because espree drops the annotation. JSX present in frame, null
    //    fixed. NOTE: after the fix, `undefined` is not in the
    //    `ReactElement | null` union, producing a LOUD typecheck error that is
    //    trivially fixed by widening/removing the annotation. Expected/OK.
    {
      code: 'const C = () => { if (!ready) return null; return <span/>; };',
      errors: [{messageId: 'nullRender'}],
      output: 'const C = () => { if (!ready) return undefined; return <span/>; };',
    },
    // 9. Early-return guard then JSX: the guard becomes `return undefined;`.
    {
      code: 'const C = ({x}) => { if (!x) return null; return <div>{x}</div>; };',
      errors: [{messageId: 'nullRender'}],
      output:
        'const C = ({x}) => { if (!x) return undefined; return <div>{x}</div>; };',
    },
  ],
});
