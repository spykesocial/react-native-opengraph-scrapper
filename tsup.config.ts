import { defineConfig } from 'tsup';

export default defineConfig({
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
  format: ['esm', 'cjs'],
  dts: false,
  sourcemap: true,
  clean: true,
  splitting: false,
  bundle: false,
  target: 'es2020',
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'cjs' ? '.cjs' : '.js',
    };
  },
});
