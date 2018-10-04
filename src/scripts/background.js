import * as general from './components/general.js';
let client =  process.env.browser == 'firefox' ? browser : chrome;
import { saveSessions, getSessions } from './components/getsetSessions.js';
import packagedAndBroadcast from './components/communications.js';
// import { registerMenus, setTabCountInBadge } from "./components/browserActions.jsx";
const { registerMenus, setTabCountInBadge,updateTabs } = require('./components/browserActions.js');
import './components/idle.js';
import {getTabs, openExcitedGemPage} from "./components/browserActions";

const sender = 'background';
const currentSender = 'background';
// let ActiveTabsConnection;

// sessions.saveSessions();
//Most of the functions starts from here
function documentready() {
  client.tabs.query({ currentWindow: true}, function(tabArray) {
    // let TabId = tabArray[0].id;
    // let port = client.tabs.connect(TabId, { name: 'ActiveTabsConnection' });
    // ActiveTabsConnection = port;
    // general.log('documentready', tabArray[0], port);
    // streamTabs(port);
  });
}
function muteAll(data) {
  for (let i = 0; i < data.length; i++) {
    client.tabs.update(tabId, { muted: true });
  }
}

function moveTab(data) {
  tabId = parseInt(data.tabId);
  position = parseInt(data.position);
  client.tabs.move(tabId, { index: position });
}

/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
function saveData(data, message = 'Data saved') {
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
}

/* Events */
///////////
client.runtime.onInstalled.addListener(() => {
  console.info('Exited Gem Installed.');
});
client.tabs.onRemoved.addListener(() => {
  client.tabs.get(homepageOpened.id, () => {
    if (client.runtime.lastError) {
      setHomePageOpened(null);
      console.log(client.runtime.lastError.message);
    } else {
      // Tab exists
    }
    console.log('tab-closed:', tab);
  });
  general.log('Excited Gem: Tab Removed/Closed.');
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
registerMenus();
