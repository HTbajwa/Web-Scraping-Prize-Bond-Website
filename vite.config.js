import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss(),],
   server: {
    proxy: {
      '/proxy': {
        target: 'https://savings.gov.pk',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/proxy/, ''),
      },
    },
  },
})

