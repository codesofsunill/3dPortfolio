import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // index.html ki location
        main: resolve(__dirname, 'index.html'),
        // projects.html ki location
        projects: resolve(__dirname, 'projects.html'),
      },
    },
  },
});