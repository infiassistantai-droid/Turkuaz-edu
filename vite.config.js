import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration — React plugin + dev server bound to all interfaces
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
})
