import * as general from './components/general.js';
let client =  process.env.browser == 'firefox' ? browser : chrome;
import { saveSessions, getSessions } from './components/getsetSessions.js';
import packagedAndBroadcast from './components/communications.js';
// import { registerMenus, setTabCountInBadge } from "./components/browserActions.jsx";
const { registerMenus, setTabCountInBadge } = require('./components/browserActions.js');
import './components/idle.js';

const sender = 'background';
const currentSender = 'background';
let ActiveTabsConnection;
let homepageOpened = null;
console.log(client);
/*Background Router */
///////////////////////
client.runtime.onMessage.addListener((request, sender) => {
  general.log(request, sender);
  if (request.receiver === 'background' && request.targetMethod === 'saveSessions') {
    saveSessions(currentSender);
  } else if (request.receiver === 'background') eval(request.targetMethod)(request.data);
});
// sessions.saveSessions();
//Most of the functions starts from here
function documentready() {
  client.tabs.query({ currentWindow: true, active: true }, function(tabArray) {
    let TabId = tabArray[0].id;
    let port = client.tabs.connect(TabId, { name: 'ActiveTabsConnection' });
    ActiveTabsConnection = port;
    general.log('documentready', tabArray[0], port);
    streamTabs(port);
  });
}

/*Tabs Streaming */
///////////////////////
function streamTabs(port) {
  if (port === undefined) return;
  port.postMessage({ tabs: general.getAllTabs(homepageOpened) });
  general.log(general.getAllTabs(homepageOpened), port);
}

//Stream Tabs data to front-end everytime when tab is created , removed , attached or detached. and
//also when extension is installed
onUpdate(() => streamTabs(ActiveTabsConnection));

client.runtime.onInstalled.addListener(() => {
  // eval(client).runtime.onInstalled.addListener(() => {
  streamTabs(ActiveTabsConnection);
});

client.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'complete') {
    general.log(tabId.title, 'complete');
    streamTabs(ActiveTabsConnection);
    // sendTabsToContent();
  }
}); //onCreated

function getTabsInRequestedWindowAndPost(tabId, info) {
  client.windows.getCurrent({ populate: true }, function(window) {
    general.log(window);
    ActiveTabsConnection.postMessage({ tabs: window.tabs });
  });
}

/**
 * Running setTabCountInBage when the browser Extension is installed ,a tab is created, removed , attached or detached.
 */
function onUpdate(functions) {
  client.runtime.onInstalled.addListener(functions);
  client.tabs.onRemoved.addListener(functions);
  client.tabs.onAttached.addListener(functions);
  client.tabs.onUpdated.addListener(functions);
}

function closeTab(tabId) {
  client.tabs.remove(parseInt(tabId));
}

function focusTab(tabId) {
  tabId = parseInt(tabId);
  client.tabs.update(tabId, { active: true });
}

function pinTab(tabId) {
  tabId = parseInt(tabId);
  client.tabs.update(tabId, { pinned: true });
}

function unpinTab(tabId) {
  tabId = parseInt(tabId);
  client.tabs.update(tabId, { pinned: false });
}

function muteTab(tabId) {
  tabId = parseInt(tabId);
  client.tabs.update(tabId, { muted: true });
}

function unmuteTab(tabId) {
  tabId = parseInt(tabId);
  client.tabs.update(tabId, { muted: false });
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
client.tabs.onCreated.addListener(() => general.log('onCreated'));
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
client.tabs.onDetached.addListener(() => general.log('onDetached'));
client.tabs.onAttached.addListener(() => general.log('onAttached'));
client.tabs.onUpdated.addListener(() => general.log('onUpdated'));

client.tabs.onMoved.addListener(function(tabId, info) {
  getTabsInRequestedWindowAndPost(tabId, info);
});
client.tabs.onUpdated.addListener(function(tabId, info) {
  getTabsInRequestedWindowAndPost(tabId, info);
});
client.tabs.onDetached.addListener(function(tabId, info) {
  getTabsInRequestedWindowAndPost(tabId, info);
});
client.tabs.onAttached.addListener(function(tabId, info) {
  getTabsInRequestedWindowAndPost(tabId, info);
});

function setHomePageOpened(newValue) {
  homepageOpened = newValue;
}

/* Browser Actions */
/////////////////////

function openExcitedGemPage(homepageOpened) {
  if (homepageOpened === undefined || homepageOpened === null) {
    client.tabs.create({ url: general.homepageURL, pinned: true }, tab => setHomePageOpened(tab));
  } else {
    client.tabs.update(homepageOpened.id, { selected: true }, () => {
      general.streamTabs(ActiveTabsConnection);
    }); //If OneTab Page is opened ,brings focus to it.
  }
}

// keepupdating tabs count on extension icon badge.
onUpdate(setTabCountInBadge);

// On clicking extension button opens EG homepage.
client.browserAction.onClicked.addListener(tab => {
  openExcitedGemPage(homepageOpened);
});
//Registering Menus
registerMenus();
