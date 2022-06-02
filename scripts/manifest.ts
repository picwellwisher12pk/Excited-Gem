import fs from "fs-extra";
import { getManifest } from "../src/manifest";
import { r, log } from "./utils";

export async function writeManifest() {
  let time = new Date();

  await fs.writeJSON(r("extension/manifest.json"), await getManifest(), {
    spaces: 2,
  });
  log(
    "PRE",
    "write manifest.json " +
      time.toLocaleString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      })
  );
}

writeManifest();
