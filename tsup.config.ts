import { defineConfig } from 'tsup';

const shared = {
  dts: false,
  sourcemap: true,
  target: 'es2020' as const,
  tsconfig: 'tsconfig.src.json',
  outDir: 'dist',
};

export default defineConfig([
  {
    ...shared,
    entry: [
      'src/index.ts',
      'src/charset.ts',
      'src/extract.ts',
      'src/fallback.ts',
      'src/fields.ts',
      'src/media.ts',
      'src/openGraphScraperLite.ts',
      'src/request.ts',
      'src/utils.ts',
    ],
    format: ['esm'],
    clean: true,
    splitting: false,
    bundle: false,
  },
  {
    ...shared,
    entry: ['src/index.ts'],
    format: ['cjs'],
    clean: false,
    splitting: false,
    bundle: true,
    outExtension() {
      return { js: '.cjs' };
    },
  },
]);
