import { dirname, relative } from "path";
import { defineConfig, UserConfig } from "vite";
import Icons from "unplugin-icons/vite";
import react from "@vitejs/plugin-react";
import IconsResolver from "unplugin-icons/resolver";
import AutoImport from "unplugin-auto-import/vite";
import WindiCSS from "vite-plugin-windicss";
import windiConfig from "./windi.config";
import { r, port, isDev } from "./scripts/utils";
// import dynamicImportVars from "@rollup/plugin-dynamic-import-vars";
// import scss from "rollup-plugin-scss";
import svgrPlugin from "vite-plugin-svgr";
import svgr from "@honkhonk/vite-plugin-svgr";

export const sharedConfig: UserConfig = {
  root: r("src"),
  resolve: {
    alias: {
      "~/": `${r("src")}/`,
      "@/": `${r("node_modules")}/`,
    },
  },
  define: {
    __DEV__: isDev,
  },
  plugins: [
    // react(),
    // scss(),
    // dynamicImportVars(),
    svgrPlugin({
      svgrOptions: {
        icon: true,
      },
    }),
    svgr(),

    AutoImport({
      imports: [
        "react",
        // {
        //   "webextension-polyfill": [["*", "browser"]],
        // },
      ],
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
    include: [
      "react",
      // "webext-bridge",
      // "webextension-polyfill"
    ],
  },
};

export default defineConfig(({ command }) => ({
  ...sharedConfig,
  base: command === "serve" ? `http://localhost:${port}/` : "/dist/",
  server: {
    port,
    strictPort: true,
    hmr: {
      host: "localhost",
      overlay: true,
    },
  },
  build: {
    outDir: r("extension/dist"),
    write: true,
    emptyOutDir: false,
    sourcemap: isDev ? "inline" : false,
    // https://developer.chrome.com/docs/webstore/program_policies/#:~:text=Code%20Readability%20Requirements
    terserOptions: {
      mangle: false,
    },
    rollupOptions: {
      input: {
        // options: r("src/options/index.html"),
        popup: r("src/pages/popup/index.html"),
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
