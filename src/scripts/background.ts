let _oneTabPageOpened: string = null; //Null or Id of OneTab Main Page
let onetabURL: string  = chrome.extension.getURL("onetab.html");
let allTabs: any[];//All tabs including Ignored Group
let refinedTabs: any[];//Not including the Ignored Group
let ignoredUrlPatterns: string[] = [
"chrome://*",
"chrome-extension://*",
"http(s)?://localhost*"
];

let ignoredDataKeys: string[] = ['url','favIconUrl','title'];
let _development: Boolean = true;

/**
 * Messaging Beacon between content and Background js
 * @param  {[type]} request [description]
 * @param  {[type]} sender) {               tabsList [description]
 * @return {[type]}         [description]
 */
// chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
// 	let url: string = chrome.extension.getURL("/onetab.html");
//     if(sender.url == url)
//     {
//     	chrome.tabs.remove(parseInt(request.closeTab),()=>{
//     		chrome.tabs.query({},
// 		    	(tabs: any[])=>{
// 		    		allTabs = tabs;
// 		    		refinedTabs = santizeTabs(tabs,ignoredUrlPatterns);
// 		    });
//         });
//     }
// });


/**
 * Logging only for development environment
 * @param  {[type]} input  [description]
 * @param  {[type]} input2 [description]
 */
function log(input: any,input2?: any):void{
	if (_development) console.log(input,input2);
}

function closeTab(tabId: any):void{
	chrome.tabs.remove(parseInt(tabId));
}

function focusTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {highlighted: true});
}
function pinTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {pinned: true});
}
function unpinTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {pinned: false});
}
function muteTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {muted: true});
}
function unmuteTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {muted: false});
}
// function muteAll(data: number[]){
// 	for (let i = 0; i<data.length;i++){
// 		chrome.tabs.update(tabId, {muted: true});
// 	}
// }
// function highlightTab(tabId: any):void{
// 	tabId =  parseInt(tabId);
// 	chrome.tabs.update(tabId, {active: true});
// }
/**
 * [saveData description]
 * @param  {string/any/Array} data    [description]
 * @param  {String} message [description]
 */
function saveData (data: any, message = "Data saved"):void {
	chrome.storage.sync.set(data, ()=> {
    	chrome.notifications.create('reminder', {
	        type: 'basic',
	        iconUrl: '../images/extension-icon48.png',
	        title: 'Data saved',
	        message: message
	     }, (notificationId: string)=> {});
    });
}


/**
 * Opens OneTab Main Page
 */
function openOneTabPage ():void {
	if(_oneTabPageOpened == null){
    	chrome.tabs.create({url: onetabURL , pinned: true},
    		(tab: any)=> {
	        	_oneTabPageOpened = tab.id;
	        	chrome.tabs.onUpdated.addListener((tabId: number , info: any)=> {
	        		if (info.status == "complete") sendTabsToContent();
	    		});//onCreated
        	});//Create Tab
	}
	else {
		chrome.tabs.update(parseInt(_oneTabPageOpened), {selected: true}, 
			sendTabsToContent);//If OneTab Page is opened ,brings focus to it.
	}
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */
function setTabCountInBadge():void{
	chrome.tabs.query({
	    currentWindow: true
	}, (tabs: any[])=>{
		chrome.browserAction.setBadgeText({
		text : String(tabs.length)
		});
	});
}

/**
 * [getAllTabs description]
 * @param  {Number} windowId   [Default to current window id -2]
 * @param  {String} returnType all | refined
 * @return {[type]}            [description]
 */
function getAllTabs(windowId: number = chrome.windows.WINDOW_ID_CURRENT,returnType: string = "all"):any[]{
	console.log("windowID",chrome.windows.WINDOW_ID_CURRENT);
    chrome.tabs.query(
    {
    	// windowId: windowId
    },
    	(tabs: any[])=> {
    		allTabs = tabs;
    		refinedTabs = santizeTabs(tabs,ignoredUrlPatterns);
    });
    console.log("getAllTabs Return:", allTabs,refinedTabs);
   	if(returnType == "all") {return allTabs;} else {return refinedTabs;}
}
/**
 * Remove tab objects from tab array based on ignore group
 * @param  {Array of objects} tabs               [description]
 * @param  {Array} ignoredUrlPatterns [description]
 * @return {Array of Object}   Returns neat array after removing ignored urls
 */
function santizeTabs(tabs: any[] , ignoredUrlPatterns: string[]):any[]{
	refinedTabs = tabs.filter((tab)=>{
		let patLength =	ignoredUrlPatterns.length;
		let url = tab.url;
		let pattern = new RegExp(ignoredUrlPatterns.join("|"), "i");
		let matched = url.match(pattern) == null;
		// log(url,pattern,matched);
		return(matched);
	});
	return refinedTabs;
}
function reSendTabsToContent () {
	getAllTabs();
	// sendToContent();
	sendTabsToContent();
}
function sendTabsToContent (tab: any = allTabs):void {
	getAllTabs();
	sendToContent("tabsList",tab);
}
/**
 * [listAllTabs description]
 * @return {[type]} [description]
 */
function sendToContent (datavariable: string, data: Tab):void {
	let obj: any = {};
	obj[datavariable] = data;
	chrome.runtime.sendMessage(obj);
}

/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
function onUpdate (functions: () => void):void {
	chrome.runtime.onInstalled.addListener(functions)
	chrome.tabs.onCreated.addListener(functions);
	chrome.tabs.onRemoved.addListener(functions);
	chrome.tabs.onDetached.addListener(functions);
	chrome.tabs.onAttached.addListener(functions);
}
onUpdate(setTabCountInBadge);
onUpdate(getAllTabs);
chrome.runtime.onInstalled.addListener(()=>{
	getAllTabs();
	sendTabsToContent();
})
/**
 * On clicking extension button
 */
chrome.browserAction.onClicked.addListener((tab: any)=> {
    openOneTabPage();
});
chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((newState: string)=>{
	if(newState == 'idle'){
		console.log("idle");
	}
});
// function tabToList (tabId: number):void {
// 	chrome.tabs.query({
//     active: true,
//     lastFocusedWindow: true
// }, (tabs: any[])=> {
//     // and use that tab to fill in out title and url
//     let tab = tabs[0];
//     sendToContent("tabsList",tab);
// });
// }
function runQuery(query: string = 'table#searchResult tbody td'){
	chrome.runtime.sendMessage(query);
	return query;
}
/**
 * Creating Context Menus
 */
chrome.contextMenus.create({
    "title": "Refresh Main Page",
    "onclick" : reSendTabsToContent ,
  });
// chrome.contextMenus.create({
//     "title": "Send Current tab to list",
//     "onclick" : tabToList() ,
//   });
// chrome.contextMenus.create({
//     "title": "Refresh Main Page including Ignored",
//     "onclick" : sendToContent(true),
//   });
chrome.contextMenus.create({
    "title": "Show Excited Gem Page",
    "onclick" : openOneTabPage,
  });
// chrome.contextMenus.create({
//     "title": "Run Query",
//     "onclick" : runQuery(),
//   });
