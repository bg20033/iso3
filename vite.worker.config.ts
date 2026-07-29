import { defineConfig } from 'vite'

export default defineConfig({
  // Static assets are already emitted by the client build. Copying `public`
  // here would bundle every gallery image into the Worker deployment.
  publicDir: false,
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
