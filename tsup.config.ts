import {defineConfig} from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/prettier.ts', 'src/stylelint.ts'],
  format: ['esm'],
  sourcemap: true,
  clean: true,
  target: 'node22',
});
