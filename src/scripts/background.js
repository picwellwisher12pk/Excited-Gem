import * as general from './components/general.js';
let env = require('../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;

// import { saveSessions, getSessions } from './components/getsetSessions.js';
// import packagedAndBroadcast from './components/communications.js';
// import { registerMenus, setTabCountInBadge } from "./components/browserActions.jsx";
// const {  setTabCountInBadge,updateTabs } = require('./components/browserActions.js');
// import './defaultPreferences';
import {log} from './components/general';
import {preferences} from './defaultPreferences';
// import './components/idle.js';
import {getTabs, openExcitedGemPage, setBadge} from "./components/browserActions";

// const sender = 'background';
// const currentSender = 'background';
// let ActiveTabsConnection;

// sessions.saveSessions();
//Most of the functions starts from here

let muteAll = (data) => {
  for (let i = 0; i < data.length; i++) {
    client.tabs.update(tabId, { muted: true });
  }
};

let moveTab = (data) => {
  tabId = parseInt(data.tabId);
  position = parseInt(data.position);
  client.tabs.move(tabId, { index: position });
};

/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
let saveData = (data, message = 'Data saved') =>{
  client.storage.local.set(data, () => {
    client.notifications.create(
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
client.runtime.onInstalled.addListener(() => {
  if (env.NODE_ENV == 'development') client.storage.local.clear(console.log("cleared")); //Previous data being removed for development version
  let jsonObj = {};
  jsonObj['preferences'] = preferences;
  console.log(preferences);
  client.storage.local.set(jsonObj,  (result) => {
    // console.log("Default preferences are being saved into local storage.");
    client.storage.local.get('preferences', (result) => {
      // console.log("preference save confirming", result);
    });

  });
  getTabs().then((tabs)=> setBadge(tabs.length));
});
client.tabs.onRemoved.addListener(() => {
  client.tabs.get(homepageOpened.id, () => {
    if (client.runtime.lastError) {
      setHomePageOpened(null);
      console.log(client.runtime.lastError.message);
    } else {
      // Tab exists
    }
    log('tab-closed:', tab);
  });
  log('Excited Gem: Tab Removed/Closed.');
});



/* Browser Actions */
/////////////////////
client.browserAction.onClicked.addListener(tab => {
  console.log("Extension Page opening");
  openExcitedGemPage();
  updateTabs(window.tabsgroup);
});




// On clicking extension button opens EG homepage.

//Registering Menus
// registerMenus();
