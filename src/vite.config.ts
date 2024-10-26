import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

declare var __dirname: string; // __dirnameを宣言

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
    },
  },
});

