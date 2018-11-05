// import { saveSessions, getSessions } from './components/getsetSessions.js';
// import packagedAndBroadcast from './components/communications.js';
// import { registerMenus, setTabCountInBadge } from "./components/browserActions.jsx";
// const {  setTabCountInBadge,updateTabs } = require('./components/browserActions.js');
// import './defaultPreferences';
import {log} from './components/general';
import {preferences} from './defaultPreferences';
import {getTabs, openExcitedGemPage, setBadge,setTabCountInBadge} from "./components/browserActions";


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
  getTabs().then((tabs)=> {window.tabs = tabs;});
}
/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
let saveData = (data, message = 'Data saved') =>{
  browser.storage.local.set(data, () => {
    browser.notifications.create(
      'reminder',
      {
        type: 'basic',
        iconUrl: '../images/extension-icon48.png',
        title: 'Data saved',
        message: message,
      },
      notificationId => {}
    );
  });
};

/* Events */
///////////
browser.runtime.onInstalled.addListener(() => {
  console.info("Excited Gem Installed!");
  if (NODE_ENV == 'development') browser.storage.local.clear(console.log("cleared")); //Previous data being removed for development version
  let jsonObj = {};
  jsonObj['preferences'] = preferences;
  console.log(preferences);
  browser.storage.local.set(jsonObj,  (result) => {
    // console.log("Default preferences are being saved into local storage.");
    browser.storage.local.get('preferences', (result) => {
      // console.log("preference save confirming", result);
    });

  });
  getTabs().then((tabs)=> setBadge(tabs.length));
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
  log('Excited Gem: Tab Removed/Closed.');
  onRemoved();
  setTabCountInBadge(tabId,true);

});



browser.tabs.onDetached.addListener(onRemoved);

browser.tabs.onCreated.addListener(
  () => {
   getTabs().then((tabs)=> setBadge(tabs.length));
  });
browser.tabs.onAttached.addListener(
  () => {
    getTabs().then((tabs)=> setBadge(tabs.length));
  });


/* Browser Actions */
/////////////////////
browser.browserAction.onClicked.addListener(tab => {
  console.info("Extension Page opening");
  openExcitedGemPage();
  // updateTabs(window.tabsgroup);
});




// On clicking extension button opens EG homepage.

//Registering Menus
// registerMenus();
