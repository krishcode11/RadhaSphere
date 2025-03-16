import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'gsap',
      '@gsap/react'
    ],
    exclude: ['qrcode.react']
  },
  plugins: [react()],
  css: {
    preprocessorOptions: {
      css: {
        additionalData: '@import "./src/style.css";'
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Chunk for node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react')) {
              return 'vendor-react'
            }
            if (id.includes('gsap')) {
              return 'vendor-gsap'
            }
            if (id.includes('qrcode')) {
              return 'vendor-qrcode'
            }
            if (id.includes('react-icons')) {
              return 'vendor-icons'
            }
            return 'vendor' // all other node_modules
          }
          
          // Chunk for pages
          if (id.includes('/pages/')) {
            return 'pages'
          }
          
          // Chunk for components
          if (id.includes('/components/')) {
            return 'components'
          }

          // Chunk for services
          if (id.includes('/services/')) {
            return 'services'
          }

          // Chunk for hooks
          if (id.includes('/hooks/')) {
            return 'hooks'
          }
        },
        inlineDynamicImports: false,
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    }
  },
  server: {
    open: true,
    port: 3000
  }
})
