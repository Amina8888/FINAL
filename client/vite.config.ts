import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5085',
        changeOrigin: true,
      },
      '/videoCallHub': {
        target: 'http://localhost:5085',
        ws: true, // ВАЖНО для WebSocket
        changeOrigin: true,
      },
    },
    allowedHosts: ['.ngrok-free.app'],
  },
})
