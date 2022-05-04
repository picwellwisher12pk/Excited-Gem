import { defineConfig } from "vite";
import { sharedConfig } from "./vite.config";
import { r, isDev } from "./scripts/utils";
import packageJson from "./package.json";

// bundling the content script using Vite
export default defineConfig({
  ...sharedConfig,
  build: {
    watch: isDev ? {} : undefined,
    outDir: r("extension/"),
    cssCodeSplit: false,
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    lib: {
      entry: r("src/background/main.js"),
      name: packageJson.name,
    },
    rollupOptions: {
      output: {
        entryFileNames: "background.js",
        extend: true,
      },
    },
  },
  plugins: [...sharedConfig.plugins!],
});
