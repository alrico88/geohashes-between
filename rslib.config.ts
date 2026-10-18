import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    { format: 'esm', dts: { autoExtension: true, distPath: './dist/esm' } },
    { format: 'cjs', dts: { autoExtension: true, distPath: './dist/cjs' } },
  ],
  source: { entry: { index: './src/index.ts' } },
  output: { cleanDistPath: true },
});
