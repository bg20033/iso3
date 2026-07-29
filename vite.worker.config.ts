import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    target: 'es2022',
    outDir: 'dist/server',
    emptyOutDir: false,
    minify: true,
    lib: {
      entry: 'worker/index.ts',
      formats: ['es'],
      fileName: () => 'index.js',
    },
  },
})
