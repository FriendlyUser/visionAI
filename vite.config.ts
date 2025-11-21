import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    // Base URL for GitHub Pages (relative path ensures it works in subdirectories)
    base: './',
    define: {
      // Injects the API key from the environment variable during the build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});