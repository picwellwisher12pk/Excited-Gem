import fs from "fs-extra";
// import { Manifest } from "webextension-polyfill";
// import type PkgType from "../package.json";
import { isDev, port, r } from "../scripts/utils";
const manifestVersion = 2;
export async function getManifest() {
  const pkg = await fs.readJSON(r("package.json"));
  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest = {
    manifest_version: manifestVersion,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
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
      scripts: ["./browser-polyfill.js", "./background.js"],
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
  const policyString = `default-src 'self' http://localhost:${port};script-src 'self' 'unsafe-eval' http://localhost:${port};connect-src 'self' ws://localhost:${port}; style-src 'self' 'unsafe-inline' http://localhost:${port}; img-src * 'self' data:  ;`;
  if (isDev) {
    if (manifestVersion === 3) {
      // for content script, as browsers will cache them for each reload,
      // we use a background script to always inject the latest version
      // see src/background/contentScriptHMR.ts
      delete manifest.content_scripts;
      manifest.permissions?.push("webNavigation");

      manifest.sandbox = { pages: ["popup.html"] };
      manifest.content_security_policy = {
        // extension_pages: policyString,
        sandbox: `sandbox allow-scripts; script-src 'self';script-src-elem 'self' http://localhost:${port}`,
      };
    }
    if (manifestVersion === 2) {
      manifest.content_security_policy = policyString;
    }
  }

  return manifest;
}
