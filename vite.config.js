import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/equipments-api': {
        target: 'ws://equipments-api.labusine.local',
        ws: true,
        changeOrigin: true
      }
    }
  },
})