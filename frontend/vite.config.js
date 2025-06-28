import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Requests to /api will be sent to Go backend
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false, // (true if using HTTPS)
      },
    }
  }
})