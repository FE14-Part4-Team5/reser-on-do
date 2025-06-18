import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import tsPathsConfig from './tsconfig.paths.json';

const aliases = Object.entries(tsPathsConfig.compilerOptions.paths).map(([key, [value]]) => ({
  find: key.replace('/*', ''),
  replacement: path.resolve(__dirname, value.replace('/*', '')),
}));

//* https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), svgr()],
//   resolve: {
//     alias: aliases,
//   },
// });

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // 기본값이지만 확인 필요
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      ...aliases,
    },
  },
  base: '/', // 👈 이거 빠지면 상대 경로 문제 생김
});
