import { defineConfig } from 'vite';

export default defineConfig({
  base: '/locomove_malhasul/',
  build: {
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2019'
  }
});