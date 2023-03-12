import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: '/src'
      }
    ]
  },
  build: {
    outDir: 'dist', //指定输出路径
    assetsDir: 'assets' //指定生成静态资源的存放路径
  },
  optimizeDeps: {
    include: [
      'antd',
      'lodash',
      'tailwindcss/plugin',
      'react',
      'react-dom',
      'react-router-dom',
      'clamped-promise-all',
      'zustand'
    ]
  }
});
