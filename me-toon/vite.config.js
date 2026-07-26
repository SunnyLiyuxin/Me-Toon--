import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  // 让构建后的 HTML 可在本地浏览器直接打开（file:// 协议）
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // 单文件内联，避免 file:// 协议下 ES 模块加载被 CORS 阻止
    cssCodeSplit: false,
    assetsInlineLimit: 100000000,
  },
})
