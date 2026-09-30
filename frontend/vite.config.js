import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Raise the warning threshold — a single-chunk app at this scale is expected.
    // Code-splitting will be introduced when routing expands to authenticated pages.
    chunkSizeWarningLimit: 600,
  },
})
