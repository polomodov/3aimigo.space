import { defineConfig } from 'vite';

export default defineConfig(({ isSsrBuild }) => ({
  base: process.env.BASE_PATH || '/',
  build: { copyPublicDir: !isSsrBuild },
}));
