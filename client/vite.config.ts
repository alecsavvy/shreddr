import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import basicSsl from '@vitejs/plugin-basic-ssl'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    basicSsl(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  envDir: '../',
  envPrefix: 'VITE_',
  server: {
    host: true,
    port: 5173,
    allowedHosts: true as const,
  }
  // Load .{mode}.env file (e.g., .localnet.env, .testnet.env, .mainnet.env)
  // Vite will automatically look for .{mode}.env in the envDir
}))
