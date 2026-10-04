import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    // The config tests load the full plugin bundle into a fresh ESLint
    // instance; the first lint in a file pays that cold load, which on a CI
    // runner exceeds vitest's 5s default even though the lint itself is fast.
    testTimeout: 30_000,
  },
});
