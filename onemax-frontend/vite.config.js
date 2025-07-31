import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'  // ✅ Sửa từ 'build' thành 'dist' để khớp với render.yaml
  }
})
