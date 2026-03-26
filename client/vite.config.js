// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 5173,
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '/api')
//       }
//     }
//   }
// })






// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     port: 3000,
//     host: '0.0.0.0',
//     allowedHosts: [
//       'localhost',
//       '127.0.0.1',
//       '.vercel.run',
//       '.vercel.app'
//     ]
//   },
//   build: {
//     outDir: 'dist',
//     sourcemap: false,
//     minify: 'esbuild'
//   }
// })




import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        "/server": {
          target: env.VITE_API_URL || "http://localhost:5001",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      modulePreload: true,
      target: 'esnext',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            dateFns: ['date-fns'],  // Separate chunk for date-fns
            // Add other large libraries here if needed
          },
        },
      },
    },
    optimizeDeps: {
      include: ['date-fns'],
    },
    resolve: {
      alias: {
        'date-fns/_lib/format/longFormatters': 'date-fns/esm/_lib/format/longFormatters',
      },
    },
  }
});