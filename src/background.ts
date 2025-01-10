import browser from "webextension-polyfill";
import { capture, save } from "./lib/generic";

browser.runtime.onMessage.addListener((requestType, sender, sendResponse) => {
  console.log('requestType', requestType);
  if (requestType.method === 'capture') {
    capture(requestType.area).then((blob) => {
      save(blob, { id: requestType.tabId })
    });
    return true;
  }
})
