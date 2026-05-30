import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

/** GitHub Pages: https://aldoshinamaria.github.io/70_LET_OBNINSKU/ */
export const GITHUB_PAGES_BASE = '/70_LET_OBNINSKU/';

export default defineConfig(({ mode }) => ({
  /** Корень для Vercel и локальной разработки; подпуть — только для GitHub Pages. */
  base: mode === 'github-pages' ? GITHUB_PAGES_BASE : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
          supabase: ['@supabase/supabase-js'],
          imaging: ['html-to-image'],
        },
      },
    },
  },
}));
