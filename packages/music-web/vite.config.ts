import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import OptimizationPersist from 'vite-plugin-optimize-persist';
import PkgConfig from 'vite-plugin-package-config';

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
      'clamped-promise-all'
    ]
  }
});
