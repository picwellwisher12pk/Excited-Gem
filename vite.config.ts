import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import webExtension, { readJsonFile } from 'vite-plugin-web-extension';
import path from 'path';
import svgr from 'vite-plugin-svgr'
import svgLoader from 'vite-svg-loader'

function generateManifest() {
  const manifest = readJsonFile('src/manifest.json');
  const pkg = readJsonFile('package.json');
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgLoader({
      defaultImport: 'url' // or 'raw'
    }),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
