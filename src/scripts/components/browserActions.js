let env = require('../../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;
import * as general from "./general.js";
/**
 * Opens OneTab Main Page
 */
// export let _oneTabPageOpened = {
//   id: null,
//   windowId: null
// };

export function getCurrentWindowTabs() {
  return client.tabs.query({ currentWindow: true });
}
export function getAllWindowTabs() {
  return client.tabs.query({});
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */
export function setTabCountInBadge(tabId, info) {
  chrome.tabs.query({
    currentWindow: true
  }, (tabs) => {
    chrome.browserAction.setBadgeText({
      text: String(tabs.length)
    });
  });
}

export function registerMenus(){
/**
 * Creating Context Menus
 */
chrome.contextMenus.removeAll();

function createReadingListMenu(data) {
  for (let i = 0; i < data.length; i++) {
    let id = String(data[i].id);
    let name = data[i].name;
    console.log("id:", id, 'name:', name);
    chrome.contextMenus.create({
      "parentId": "showreadinglists",
      "id": id,
      "title": name,
      "onclick"() { }
    });
    chrome.contextMenus.create({
      "parentId": "addreadinglists",
      "id": id + "create",
      "title": name,
      "onclick"() { }
    });
  }

  console.log("menu", data);
}

chrome.contextMenus.create({
  "title": "Refresh Main Page",
  "onclick"() { streamTabs(ActiveTabsConnection); }
});
// chrome.contextMenus.create({
//     "title": "Send Current tab to list",
//     "onclick" : tabToList ,
//   });
// chrome.contextMenus.create({
//     "title": "Refresh Main Page including Ignored",
//     "onclick" : sendToContent(true),
//   });
chrome.contextMenus.create({
  "title": "Show Excited Gem Page",
  // "onclick": openExcitedGemPage
});
chrome.contextMenus.create({
  "title": "Add to Reading Lists",
  "id": "addreadinglists"
});
chrome.contextMenus.create({
  "title": "Show Reading Lists",
  "id": "showreadinglists"
});

// chrome.contextMenus.create({
//     "title": "Run Query",
//     "onclick" : runQuery,
//   });
}
