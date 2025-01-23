import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'axios',
            'zustand'
          ],
          ui: [
            '@/components/ui/button',
            '@/components/ui/form',
            '@/components/ui/input',
            '@/components/ui/select',
            '@/components/ui/switch',
            '@/components/ui/label',
            '@radix-ui/react-dialog',
            '@radix-ui/react-select'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
});
