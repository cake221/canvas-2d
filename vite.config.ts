import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vitejs.dev/config/
export default defineConfig({
  root: "./demos",
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/canvas-2d/" : "./",
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  }
})
