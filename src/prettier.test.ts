/**
 * Prettier config parity: classes inside `cn(...)` sort exactly like inside
 * `twMerge(...)`, in a plain argument, a ternary branch, and an array element.
 * Expected outputs are hard-coded so a regression in `tailwindFunctions`
 * fails here instead of passing against a recomputed value.
 */
import {format} from 'prettier';
import {describe, expect, it} from 'vitest';
import config from './prettier.js';

const UNSORTED = 'text-white px-2 bg-red-500';
const SORTED = 'bg-red-500 px-2 text-white';

const formatSource = (source: string): Promise<string> =>
  format(source, {...config, parser: 'typescript'});

describe('prettier config tailwindFunctions', () => {
  it('lists cn alongside twJoin and twMerge', () => {
    expect(config.tailwindFunctions).toContain('cn');
    expect(config.tailwindFunctions).toContain('twJoin');
    expect(config.tailwindFunctions).toContain('twMerge');
  });

  it.each([
    [
      'plain argument',
      `cn('${UNSORTED}')`,
      `cn('${SORTED}');\n`,
    ],
    [
      'ternary branch',
      `cn(c ? '${UNSORTED}' : undefined)`,
      `cn(c ? '${SORTED}' : undefined);\n`,
    ],
    [
      'array element',
      `cn(['${UNSORTED}'])`,
      `cn(['${SORTED}']);\n`,
    ],
  ])('sorts classes in cn: %s', async (_name, source, expected) => {
    expect(await formatSource(source)).toBe(expected);
  });

  it.each([
    [
      'plain argument',
      `twMerge('${UNSORTED}')`,
      `twMerge('${SORTED}');\n`,
    ],
    [
      'ternary branch',
      `twMerge(c ? '${UNSORTED}' : undefined)`,
      `twMerge(c ? '${SORTED}' : undefined);\n`,
    ],
    [
      'array element',
      `twMerge(['${UNSORTED}'])`,
      `twMerge(['${SORTED}']);\n`,
    ],
  ])('keeps sorting classes in twMerge: %s', async (_name, source, expected) => {
    expect(await formatSource(source)).toBe(expected);
  });
});
