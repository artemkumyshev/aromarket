import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: env.VITE_HOST || env.HOST || 'localhost',
      port: env.VITE_PORT ? Number(env.VITE_PORT) : (env.PORT ? Number(env.PORT) : 5173),
      strictPort: env.VITE_STRICT_PORT === 'true' || false,
      proxy: env.VITE_API_BASE_URL ? {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      } : undefined,
    },
    define: {
      // Make env variables available in the app
      __APP_TITLE__: JSON.stringify(env.VITE_APP_TITLE || 'Fullstack Application'),
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '0.0.1'),
      __APP_DESCRIPTION__: JSON.stringify(env.VITE_APP_DESCRIPTION || 'Fullstack Starter Template'),
    },
  };
});
