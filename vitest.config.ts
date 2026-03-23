import { resolve } from 'path';
import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  oxc: false,
  test: {
    globals: true,
    root: './',
    alias: {
      src: resolve(__dirname, './src'),
      '@src': './src',
      '@test': './test',
      '@app/shared': 'libs/shared/src',
      '@app/': 'src/',
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
    }),
  ],
  resolve: {
    alias: {
      src: resolve(__dirname, './src'),
      '@src': './src',
      '@test': './test',
      '@app/shared': 'libs/shared/src',
      '@app/': 'src/',
    },
  },
});
