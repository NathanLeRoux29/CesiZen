import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const API_URL = process.env.VITE_API_URL || 'http://localhost:3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: process.env.VITE_PORT || 5173,
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true,
      },
    },
  },
})
