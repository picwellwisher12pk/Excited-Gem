let env = require('../../../utils/env');
import {preferences} from '../defaultPreferences';
let client =  env.browserClient == 'firefox' ? browser : chrome;

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
  return preferences.defaultTabsFrom == 'current' ? client.tabs.query({ currentWindow: true }) : client.tabs.query({});
}

export function updateTabs(reactObject = window.activeTabs) {
  let result = preferences.defaultTabsFrom == 'current' ? getCurrentWindowTabs() : getAllWindowTabs();
  result.then(tabs => {
    window.tabs = tabs;
   console.log('inside updatetabs function:',tabs);
   reactObject.setState({tabs: tabs} );
    // $('.active-tab-counter').text(tabs.length);
    // $('#allWindows span.count').text(tabs.length);

    // $('#currentWindow span.count').text(tabs.length);
    // if (tabs.length >= 50)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-warning');
    // if (tabs.length >= 100)  $('#currentWindow span.count, #allWindows span.count').toggleClass('label-success label-danger');
  });
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */
export function setBadge(length){
    client.browserAction.setBadgeText({text: length.toString()});
    client.browserAction.setBadgeTextColor({color: white});
    client.browserAction.setBadgeBackgroundColor({'color': length <= 50 ? 'green' : 'red'});
}
export function setTabCountInBadge(tabId, isOnRemoved) {
  getTabs()
    .then((tabs) => {
      let length = tabs.length;
      if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        length--;
      }
      setBadge(length);
    });
}

export function registerMenus(){
/**
 * Creating Context Menus
 */
client.contextMenus.removeAll();

function createReadingListMenu(data) {
  for (let i = 0; i < data.length; i++) {
    let id = String(data[i].id);
    let name = data[i].name;
    console.log("id:", id, 'name:', name);
    client.contextMenus.create({
      "parentId": "showreadinglists",
      "id": id,
      "title": name,
      "onclick"() { }
    });
    client.contextMenus.create({
      "parentId": "addreadinglists",
      "id": id + "create",
      "title": name,
      "onclick"() { }
    });
  }

  console.log("menu", data);
}

// client.contextMenus.create({
//   "title": "Refresh Main Page",
//   "onclick"() { streamTabs(ActiveTabsConnection); }
// });
// client.contextMenus.create({
//     "title": "Send Current tab to list",
//     "onclick" : tabToList ,
//   });
// client.contextMenus.create({
//     "title": "Refresh Main Page including Ignored",
//     "onclick" : sendToContent(true),
//   });
client.contextMenus.create({
  "title": "Show Excited Gem Page",
  // "onclick": openExcitedGemPage
});
client.contextMenus.create({
  "title": "Add to Reading Lists",
  "id": "addreadinglists"
});
client.contextMenus.create({
  "title": "Show Reading Lists",
  "id": "showreadinglists"
});

// client.contextMenus.create({
//     "title": "Run Query",
//     "onclick" : runQuery,
//   });
}
