import { submit } from "publish-browser-extension";
import { readFileSync } from "fs";
import { join } from "path";

async function run() {
  try {
    const keysPath = join(process.cwd(), "keys.json");
    const keys = JSON.parse(readFileSync(keysPath, "utf8"));

    console.log("🚀 Starting publication to Chrome Web Store...");

    const result = await submit({
      dryRun: false,
      chrome: {
        zip: join(process.cwd(), "build/chrome-mv3-prod.zip"),
        extensionId: keys.chrome.extId,
        clientId: keys.chrome.clientId,
        clientSecret: keys.chrome.clientSecret,
        refreshToken: keys.chrome.refreshToken,
        publish: true,
      },
      // You can add 'edge' or 'firefox' here later if you re-add them to keys.json
    });

    console.log("✅ Publication details:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("❌ Publication failed:", error);
    process.exit(1);
  }
}

run();
