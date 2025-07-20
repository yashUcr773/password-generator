import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-checkbox', '@radix-ui/react-slider', '@radix-ui/react-label', '@radix-ui/react-slot'],
          icons: ['lucide-react'],
        },
      },
    },
    // Optimize for production
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: false,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
  },
  // PWA and security headers
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
})
