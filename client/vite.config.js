// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(), 
    tailwindcss()
  ],
  server: {
    // Yaha hum proxy set kar rahe hain
    proxy: {
      // Jab bhi frontend '/api' par request bhejega, Vite automatically usko 'http://localhost:3000/api' par bhej dega
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // rewrite ka kaam: Agar zaroorat pade toh path modify karna. Par abhi ke liye ye safe hai.
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
