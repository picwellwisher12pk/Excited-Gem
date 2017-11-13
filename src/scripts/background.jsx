import * as general from "./components/general.js";
import { saveSessions, getSessions} from "./components/getsetSessions.jsx";
import packagedAndBroadcast from "./components/communications.js";
// import { registerMenus, setTabCountInBadge } from "./components/browserActions.jsx";
const { registerMenus, setTabCountInBadge } = require("./components/browserActions.jsx");
import "./components/idle.jsx";

const sender = "background";
let ActiveTabsConnection;
let homepageOpened = null;

/*Background Router */
///////////////////////
chrome.runtime.onMessage.addListener((request, sender) => {
  general.log(request, sender);
  if (request.receiver == "background") eval(request.targetMethod)(request.data);
});

//Most of the functions starts from here
function documentready() {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabArray) {
    let TabId = tabArray[0].id;
    let port = chrome.tabs.connect(TabId, { name: "ActiveTabsConnection" });
    ActiveTabsConnection = port;
    general.log("documentready", tabArray[0], port);
    streamTabs(port);
  });
}

/*Tabs Streaming */
///////////////////////
function streamTabs(port) {
  if (port == undefined) return;
  port.postMessage({ tabs: general.getAllTabs(homepageOpened) });
  general.log(general.getAllTabs(homepageOpened), port);
}

//Stream Tabs data to front-end everytime when tab is created , removed , attached or detached. and
//also when extension is installed
onUpdate(() => streamTabs(ActiveTabsConnection));

chrome.runtime.onInstalled.addListener(() => {
  streamTabs(ActiveTabsConnection);
})


chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status == "complete") {
    general.log(tabId.title, "complete");
    streamTabs(ActiveTabsConnection);
    // sendTabsToContent();
  }
});//onCreated

function getTabsInRequestedWindowAndPost(tabId, info) {
  chrome.windows.getCurrent({ populate: true }, function (window) {
    general.log(window);
    ActiveTabsConnection.postMessage({ tabs: window.tabs });
  });
}

/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
function onUpdate(functions) {
  chrome.runtime.onInstalled.addListener(functions)
  chrome.tabs.onRemoved.addListener(functions);
  chrome.tabs.onAttached.addListener(functions);
  chrome.tabs.onUpdated.addListener(functions);
}

function closeTab(tabId){
	chrome.tabs.remove(parseInt(tabId));
}
function focusTab(tabId){
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {selected: true});
}
function pinTab(tabId){
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {pinned: true});
}
function unpinTab(tabId){
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {pinned: false});
}
function muteTab(tabId){
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {muted: true});
}
function unmuteTab(tabId){
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {muted: false});
}
function muteAll(data){
	for (let i = 0; i<data.length;i++){
		chrome.tabs.update(tabId, {muted: true});
	}
}
function moveTab(data){
	tabId =  parseInt(data.tabId);
	position =  parseInt(data.position);
	chrome.tabs.move(tabId, {index: position});

}

/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
function saveData (data, message = "Data saved") {
	chrome.storage.local.set(data, ()=> {
    	chrome.notifications.create('reminder', {
	        type: 'basic',
	        iconUrl: '../images/extension-icon48.png',
	        title: 'Data saved',
	        message: message
	     }, (notificationId)=> {});
    });
}

/* Events */
///////////
chrome.runtime.onInstalled.addListener(()=>{ console.info("Exited Gem Installed."); } );
chrome.tabs.onCreated.addListener(()=>general.log("onCreated"));
chrome.tabs.onRemoved.addListener(()=>{
  chrome.tabs.get(homepageOpened.id, ()=>{
    if (chrome.runtime.lastError) {
      setHomePageOpened(null);
      console.log(chrome.runtime.lastError.message);
    } else {
      // Tab exists
    }
    console.log("tab-closed:",tab);
  })
  general.log("Excited Gem: Tab Removed/Closed.")}
);
chrome.tabs.onDetached.addListener(()=>general.log("onDetached"));
chrome.tabs.onAttached.addListener(()=>general.log("onAttached"));
chrome.tabs.onUpdated.addListener(()=>general.log("onUpdated"));

chrome.tabs.onMoved.addListener(function(tabId, info){
	getTabsInRequestedWindowAndPost(tabId,info);
});
chrome.tabs.onUpdated.addListener(function(tabId, info){
	getTabsInRequestedWindowAndPost(tabId, info);
});
chrome.tabs.onDetached.addListener(function(tabId, info){
	getTabsInRequestedWindowAndPost(tabId, info);
});
chrome.tabs.onAttached.addListener(function(tabId, info){
	getTabsInRequestedWindowAndPost(tabId, info);
});
function setHomePageOpened(newValue){
  homepageOpened = newValue;
}

/* Browser Actions */
/////////////////////

function openExcitedGemPage(homepageOpened) {
  if (homepageOpened === undefined || homepageOpened === null) {
      chrome.tabs.create({ url: general.homepageURL, pinned: true }, (tab) => { 
        setHomePageOpened(tab);
      });
    }
    else {
      chrome.tabs.update(homepageOpened.id, { selected: true }, () => {
        general.streamTabs(ActiveTabsConnection);
      });//If OneTab Page is opened ,brings focus to it.
    }
  }

  // keepupdating tabs count on extension icon badge.
  onUpdate(setTabCountInBadge);

  // On clicking extension button opens EG homepage.
chrome.browserAction.onClicked.addListener((tab) => { 
  openExcitedGemPage(homepageOpened);
});
  //Registering Menus
  registerMenus();