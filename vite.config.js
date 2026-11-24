import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  optimizeDeps: {
    include: ['recharts', 'react-is', 'framer-motion', 'lucide-react'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
  },
})
