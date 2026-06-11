import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages 배포 시 base 경로를 리포명으로 설정 (restboy2606.github.io/2026-06-10/)
export default defineConfig({
  plugins: [react()],
  base: '/2026-06-10/',
})
