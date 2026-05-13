import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;

          const normalizedId = id.replace(/\\/g, '/');

          if (
            normalizedId.includes('/react/') ||
            normalizedId.includes('/react-dom/') ||
            normalizedId.includes('/react-router-dom/') ||
            normalizedId.includes('/react-router/') ||
            normalizedId.includes('/@remix-run/') ||
            normalizedId.includes('/scheduler/')
          ) {
            return 'react-vendor';
          }

          if (normalizedId.includes('/@firebase/firestore') || normalizedId.includes('/firebase/firestore')) {
            return 'firebase-firestore';
          }

          if (normalizedId.includes('/@firebase/auth') || normalizedId.includes('/firebase/auth')) {
            return 'firebase-auth';
          }

          if (normalizedId.includes('/@firebase/') || normalizedId.includes('/firebase/')) {
            return 'firebase-core';
          }

          if (normalizedId.includes('/lucide-react/')) {
            return 'icons';
          }

          if (normalizedId.includes('/framer-motion/')) {
            return 'motion';
          }

          if (normalizedId.includes('/xlsx/')) {
            return 'spreadsheet';
          }

          return 'vendor';
        },
      },
    },
  },
});
