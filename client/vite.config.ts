import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
  ],
  envDir: '../',
  envPrefix: 'VITE_',
  // Load .{mode}.env file (e.g., .localnet.env, .testnet.env, .mainnet.env)
  // Vite will automatically look for .{mode}.env in the envDir
}))
