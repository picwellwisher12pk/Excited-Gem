let env = require('../../../utils/env');
import {preferences} from '../defaultPreferences';
var browser = require("webextension-polyfill");

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
    browser.tabs.create({ url: general.homepageURL, pinned: true }, tab => window.homepageOpened = tab);
  } else {
    browser.tabs.update(window.homepageOpened.id, { selected: true }); //If OneTab Page is opened ,brings focus to it.
  }
}
export function getCurrentWindowTabs() {
  return browser.tabs.query({ currentWindow: true });
}
export function getAllWindowTabs() {
  return browser.tabs.query({});
}
export function getTabs(){
  return preferences.defaultTabsFrom === 'current' ? browser.tabs.query({ currentWindow: true }) : browser.tabs.query({});
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
    browser.browserAction.setBadgeText({text: length.toString()});
    // browser.browserAction.setBadgeTextColor({color: 'white'}); //Not compatible with chrome
    browser.browserAction.setBadgeBackgroundColor({'color': length <= 50 ? 'green' : 'red'});
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
browser.contextMenus.removeAll();

function createReadingListMenu(data) {
  for (let i = 0; i < data.length; i++) {
    let id = String(data[i].id);
    let name = data[i].name;
    console.log("id:", id, 'name:', name);
    browser.contextMenus.create({
      "parentId": "showreadinglists",
      "id": id,
      "title": name,
      "onclick"() { }
    });
    browser.contextMenus.create({
      "parentId": "addreadinglists",
      "id": id + "create",
      "title": name,
      "onclick"() { }
    });
  }

  console.log("menu", data);
}

// browser.contextMenus.create({
//   "title": "Refresh Main Page",
//   "onclick"() { streamTabs(ActiveTabsConnection); }
// });
// browser.contextMenus.create({
//     "title": "Send Current tab to list",
//     "onclick" : tabToList ,
//   });
// browser.contextMenus.create({
//     "title": "Refresh Main Page including Ignored",
//     "onclick" : sendToContent(true),
//   });
browser.contextMenus.create({
  "title": "Show Excited Gem Page",
  // "onclick": openExcitedGemPage
});
browser.contextMenus.create({
  "title": "Add to Reading Lists",
  "id": "addreadinglists"
});
browser.contextMenus.create({
  "title": "Show Reading Lists",
  "id": "showreadinglists"
});

// browser.contextMenus.create({
//     "title": "Run Query",
//     "onclick" : runQuery,
//   });
}
