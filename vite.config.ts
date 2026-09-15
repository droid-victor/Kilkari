import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    // Firebase (Auth + Firestore) is used by both the storefront (product
    // reads) and the admin panel, so it can't be fully code-split away from
    // the main bundle without restructuring the data layer. Raise the
    // warning threshold rather than chase a cosmetic warning.
    chunkSizeWarningLimit: 1200,
  },
})
