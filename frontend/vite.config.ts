import path from 'node:path';
import { defineConfig } from 'vitest/config';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src')
    }
  },
  test: {
    environment: 'happy-dom',
    exclude: ['e2e/**', 'node_modules/**'],
    setupFiles: './src/test/setup.ts'
  }
});
