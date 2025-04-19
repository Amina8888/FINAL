// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// // import tailwindcss from "@tailwindcss/vite";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [
//     react(),
//     // tailwindcss()
//   ],
// })

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import nodePolyfills from 'rollup-plugin-node-polyfills';

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis'
  },
  resolve: {
    alias: {
      stream: 'stream-browserify',
      crypto: 'crypto-browserify',
      buffer: 'buffer',
      util: 'util',
      process: 'process/browser',
      events: 'events'
    }
  },
  optimizeDeps: {
    include: ['simple-peer']
  },
  build: {
    rollupOptions: {
      plugins: [nodePolyfills()]
    }
  }
});

