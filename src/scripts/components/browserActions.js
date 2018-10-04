let env = require('../../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;
let pref = {
  filterType: 'regex',
  filterCase: 'true',
  windowType: 'current'
};
import * as general from "./general.js";
/**
 * Opens OneTab Main Page
 */
// export let _oneTabPageOpened = {
//   id: null,
//   windowId: null
// };
// function setHomePageOpened(newValue) {
//   window.homepageOpened = newValue;
// }
export function openExcitedGemPage() {
  if (window.homepageOpened === undefined || window.homepageOpened === null) {
    client.tabs.create({ url: general.homepageURL, pinned: true }, tab => window.homepageOpened = tab);
  } else {
    client.tabs.update(window.homepageOpened.id, { selected: true }); //If OneTab Page is opened ,brings focus to it.
  }
}
export function getCurrentWindowTabs() {
  return client.tabs.query({ currentWindow: true });
}
export function getAllWindowTabs() {
  return client.tabs.query({});
}
export function getTabs(){
  console.log('getabs', pref.windowType);
  return pref.windowType == 'current' ? client.tabs.query({ currentWindow: true }) : client.tabs.query({});
}

export function updateTabs(reactObject) {
  let result = pref.windowType == 'current' ? getCurrentWindowTabs() : getAllWindowTabs();
  result.then(tabs => {
    window.tabsList = tabs;
   reactObject.setState({tabs: window.tabsList} );
    $('.active-tab-counter').text(tabs.length);
    $('#allWindows span.count').text(tabs.length);

    $('#currentWindow span.count').text(tabs.length);
    if (tabs.length >= 50)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-warning');
    if (tabs.length >= 100)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-danger');
  });
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */

export function setTabCountInBadge(tabId, isOnRemoved) {
  browser.tabs.query({})
    .then((tabs) => {
      let length = tabs.length;

      // onRemoved fires too early and the count is one too many.
      // see https://bugzilla.mozilla.org/show_bug.cgi?id=1396758
      if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        length--;
      }

      client.browserAction.setBadgeText({text: length.toString()});
      if (length > 2) {
        client.browserAction.setBadgeBackgroundColor({'color': 'green'});
      } else {
        client.browserAction.setBadgeBackgroundColor({'color': 'red'});
      }
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
