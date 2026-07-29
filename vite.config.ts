import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from './build/sites-vite-plugin.ts'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sites()],
})
