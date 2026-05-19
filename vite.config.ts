import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/syokumukeirekisyo/',
  server: {
    host: true,   // 0.0.0.0 でLAN公開 → Android実機からアクセス可
    port: 5173,
  },
})
