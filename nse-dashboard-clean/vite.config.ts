import { defineConfig } from 'vite';
import typescriptPlugin from './scripts/typescript-plugin';
import path from 'node:path';
export default defineConfig({ plugins: [typescriptPlugin()], resolve: { alias: { '@': path.resolve(__dirname, './src') } }, server: { host: 'localhost', port: 8081, strictPort: true, proxy: { '/nse-api': { target: 'http://localhost:5000', changeOrigin: true } } } });
