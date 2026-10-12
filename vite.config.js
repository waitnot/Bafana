import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  assetsInclude: ['**/*.heic', '**/*.HEIC'],
  preview: {
    allowedHosts: 'all',
    host: '0.0.0.0',
    port: 10000,
  },
  server: {
    watch: {
      // Ignore raw images and built output — large files crash the watcher
      ignored: ['**/images/**', '**/dist/**', '**/dist1_extracted/**'],
    },
  },
})
