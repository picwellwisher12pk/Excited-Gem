import fs from "fs-extra";
// import { Manifest } from "webextension-polyfill";
// import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";

export async function getManifest() {
  const pkg = await fs.readJSON(r("package.json"));
  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest = {
    manifest_version: 3,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    action: {
      default_icon: {
        19: "assets/icon.svg",
        38: "assets/icon.svg",
      },
      default_title: "Excited Gem",
    },
    // options_ui: {
    //   page: "./dist/options/index.html",
    //   open_in_tab: true,
    //   chrome_style: false,
    // },
    background: {
      service_worker: "./background.js",
      type: "module",
    },
    icons: {
      16: "assets/icon.svg",
      48: "assets/icon.svg",
      128: "assets/icon.svg",
    },
    permissions: [
      "activeTab",
      "contextMenus",
      "notifications",
      "storage",
      "tabs",
      "unlimitedStorage",
    ],
    // content_security_policy: {
    //   extension_pages:
    //     "default-src http://localhost:* 'self';script-src http://localhost:* 'self'; object-src 'none'",
    // },
    // content_scripts: [
    //   {
    //     matches: ["http://*/*", "https://*/*"],
    //     js: ["./dist/contentScripts/index.global.js"],
    //   },
    // ],
    // web_accessible_resources: ["dist/contentScripts/style.css"],
  };

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts;
    manifest.permissions?.push("webNavigation");

    manifest.sandbox = { pages: ["popup.html"] };
    manifest.content_security_policy = {
      extension_pages: `default-src 'self' http://localhost:${port};script-src http://localhost:${port} 'self';`,
      sandbox: `sandbox allow-scripts; script-src 'self' http://localhost:${port};script-src-elem 'self' http://localhost:${port}`,
    };
  }

  return manifest;
}
