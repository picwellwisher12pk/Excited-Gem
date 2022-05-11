// import { sendMessage, onMessage } from "webext-bridge";
import { preferences } from "~/scripts/defaultPreferences";
import {
  getTabs,
  setBadge,
  setTabCountInBadge,
} from "~/scripts/browserActions";

// only on dev mode
// if (import.meta.hot) {
//   // @ts-expect-error for background HMR
//   import("/@vite/client");
//   // load latest content script
//   import("./contentScriptHMR");
// }

// let muteAll = (data) => {
//   for (let i = 0; i < data.length; i++) {
//     browser.tabs.update(tabId, { muted: true });
//   }
// };

// let moveTab = (data) => {
//   tabId = parseInt(data.tabId);
//   position = parseInt(data.position);
//   browser.tabs.move(tabId, { index: position });
// };
function onRemoved(tabId, removeInfo) {
  getTabs().then((tabs) => {
    // window.tabs = tabs;
  });
}

/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
// let saveData = (data, message = "Data saved") => {
//   browser.storage.local.set(data, () => {
//     browser.notifications.create(
//       "reminder",
//       {
//         type: "basic",
//         iconUrl: "../images/extension-icon48.png",
//         title: "Data saved",
//         message: message,
//       },
//       (notificationId) => {}
//     );
//   });
// };

/* Events */
///////////
browser.runtime.onInstalled.addListener(() => {
  let jsonObj = {};
  jsonObj["preferences"] = preferences;
  browser.storage.local.set(jsonObj).then((result) => {
    browser.storage.local.get("preferences").then((result) => {});
  });
  getTabs("current").then((tabs) => setBadge(tabs.length));
});
browser.tabs.onRemoved.addListener((tabId) => {
  // browser.tabs.get(homepageOpened.id, () => {
  //   if (browser.runtime.lastError) {
  //     setHomePageOpened(null);
  //     console.log(browser.runtime.lastError.message);
  //   } else {
  //     // Tab exists
  //   }
  //   log('tab-closed:', tab);
  // });
  console.log("Excited Gem: Tab Removed/Closed.");
  onRemoved();
  setTabCountInBadge(tabId, true);
});

browser.tabs.onDetached.addListener(onRemoved);

browser.tabs.onCreated.addListener(() => {
  getTabs("current").then((tabs) => setBadge(tabs.length));
});
browser.tabs.onAttached.addListener(() => {
  getTabs("current").then((tabs) => setBadge(tabs.length));
});

/* Browser Actions */
browser.browserAction.onClicked.addListener((tab) => {
  console.info("Extension Page opening");
  browser.tabs
    .create({ url: browser.runtime.getURL("popup.html"), pinned: true })
    .then((tab) => tab);
});

// On clicking extension button opens EG homepage.

//Registering Menus
// registerMenus();

// browser.runtime.onMessage.addListener(function (
//   message,
//   sender,
//   senderResponse
// ) {
//   if (message.msg === "image") {
//     fetch("https://some-random-api.ml/img/pikachu")
//       .then((response) => response.text())
//       .then((data) => {
//         let dataObj = JSON.parse(data);
//         senderResponse({ data: dataObj, index: message.index });
//       })
//       .catch((error) => console.log("error", error));
//     return true; // Will respond asynchronously.
//   }
// });
