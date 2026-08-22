import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path, { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      sourcemap: false, // Turn off sourcemaps in production to save build time and space
      chunkSizeWarningLimit: 2000,
      target: 'esnext',
      cssCodeSplit: false, // Output a single CSS file to fix missing CSS issues across dual builds
      minify: 'esbuild',
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          admin: resolve(__dirname, 'admin.html'),
        },
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('/node_modules/lucide-react/')) {
                return 'vendor-icons';
              }
              if (id.includes('/node_modules/framer-motion/') || id.includes('/node_modules/motion/')) {
                return 'vendor-animation';
              }
              if (id.includes('/node_modules/@firebase/') || id.includes('/node_modules/firebase/')) {
                return 'vendor-firebase';
              }
              // Let Vite handle react automatically to avoid circular chunks
              return 'vendor-core'; 
            }
          },
        },
      },
    },
    server: { 
      host: '0.0.0.0', 
      port: 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
