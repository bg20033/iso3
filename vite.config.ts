import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from './build/sites-vite-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sites()],
  build: {
    // Sites binds static files from `dist/client` and the Worker from
    // `dist/server`.
    outDir: 'dist/client',
  },
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
})
