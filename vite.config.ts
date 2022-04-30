import { dirname, relative } from "path";
import { defineConfig, UserConfig } from "vite";
import Icons from "unplugin-icons/vite";
import react from "@vitejs/plugin-react";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import WindiCSS from "vite-plugin-windicss";
import windiConfig from "./windi.config";
import { r, port, isDev } from "./scripts/utils";

export const sharedConfig: UserConfig = {
  root: r("src"),
  resolve: {
    alias: {
      "~/": `${r("src")}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    react(),

    AutoImport({
      imports: [
        "react",
        {
          "webextension-polyfill": [["*", "browser"]],
        },
      ],
      dts: r("src/auto-imports.d.ts"),
    }),

    // https://github.com/antfu/unplugin-react-components
    /* Components({
      dirs: [r("src/components")],
      // generate `components.d.ts` for ts support with Volar
      dts: true,
      resolvers: [
        // auto import icons
        IconsResolver({
          componentPrefix: "",
        }),
      ],
    }), */

    // https://github.com/antfu/unplugin-icons
    Icons(),

    // rewrite assets to use relative path
    {
      name: "assets-rewrite",
      enforce: "post",
      apply: "build",
      transformIndexHtml(html, { path }) {
        return html.replace(
          /"\/assets\//g,
          `"${relative(dirname(path), "/assets")}/`
        );
      },
    },
  ],
  optimizeDeps: {
    include: ["react", "webextension-polyfill"],
  },
};

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
  server: {
    port,
    hmr: {
      host: "localhost",
    },
  },
  build: {
    outDir: r("extension/dist"),
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        background: r("src/background/main.js"),
        options: r("src/options/index.html"),
        popup: r("src/popup/index.html"),
      },
    },
  },
  plugins: [
    ...sharedConfig.plugins!,

    // https://github.com/antfu/vite-plugin-windicss
    WindiCSS({
      config: windiConfig,
    }),
  ],
}));
