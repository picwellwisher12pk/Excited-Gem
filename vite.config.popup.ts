import { defineConfig } from "vite";
import WindiCSS from "vite-plugin-windicss";
import { sharedConfig } from "./vite.config";
import { r, isDev } from "./scripts/utils";
import windiConfig from "./windi.config";
import packageJson from "./package.json";
import react from "@vitejs/plugin-react";

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r("extension/"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? "hidden" : false,
    lib: {
      entry: r("src/pages/popup/main.jsx"),
      name: packageJson.name,
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "popup.js",
        extend: true,
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,
    react(),
    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: {
        ...windiConfig,
        // disable preflight to avoid css population
        preflight: false,
      },
    }),
  ],
});
