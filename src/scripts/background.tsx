function packageData(sender:string,receiver:string,targetMethod:String,data: any): Object{
	let package :Object = {
		sender: sender,
		receiver: receiver,
		targetMethod:targetMethod,
		data: data
	};
 	return package;
}

function packageAndBroadcast(sender:string = sender,receiver:string,targetMethod:String,data: any){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
					// chrome.runtime.sendMessage());
                    chrome.tabs.sendMessage(tabs[0].id, packageData(sender,receiver,targetMethod,data);
        });
		
}
chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
   
    if (request.openUrlInEditor)
     sendResponse({msg: getAllTabs()});
      console.log("external/",request.openUrlInEditor);
  });

function streamTabs(port){
	if(port == undefined) return;
	port.postMessage({tabs : getAllTabs()});
	console.log(getAllTabs(),port);
}
let ActiveTabsConnection;
function documentready(){
	chrome.tabs.query({currentWindow: true, active: true}, function(tabArray) {
	    let TabId = tabArray[0].id;
	    let port = chrome.tabs.connect(TabId, {name: "ActiveTabsConnection"});
	    ActiveTabsConnection = port;
	    console.log("documentready",tabArray[0],port);
	    streamTabs(port);
	    
	});

}

chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
	console.log(request,sender);
	if(request.receiver == "background") {
		 eval(request.targetMethod)(request.data);
	});	
});

let _oneTabPageOpened: String = null; //Null or Id of OneTab Main Page
let onetabURL: String  = chrome.extension.getURL("excited_gem_tabs.html");
let allTabs: Array<Object>; //All tabs including Ignored Group
let refinedTabs: Array<Object>;//Not including the Ignored Group
let ignoredUrlPatterns: Array<string> = [
"chrome://*",
"chrome-extension://*",
"http(s)?://localhost*"
];

let ignoredDataKeys: Array<String> = ['url','favIconUrl','title'];
let _development: Boolean = true;
let sender: string="background";

/**
 * Logging only for development environment
 * @param  {[type]} input  [description]
 * @param  {[type]} input2 [description]
 */
function log(input: any,input2?: any):void{
	if (_development) console.log(input,input2);
}

function closeTab(tabId:Number):void{
	chrome.tabs.remove(parseInt(tabId));
}

function focusTab(tabId: any):void{
	tabId =  parseInt(tabId);
	chrome.tabs.update(tabId, {selected: true});
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
function muteAll(data: Number[]){
	for (let i = 0; i<data.length;i++){
		chrome.tabs.update(tabId, {muted: true});
	}
}
function moveTab(data){
	tabId =  parseInt(data.tabId);
	position =  parseInt(data.position);
	chrome.tabs.move(tabId, {index: position});
	
}
// function highlightTab(tabId: any):void{
// 	tabId =  parseInt(tabId);
// 	chrome.tabs.update(tabId, {active: true});
// }
/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
function saveData (data: any, message = "Data saved"):void {
	chrome.storage.sync.set(data, ()=> {
    	chrome.notifications.create('reminder', {
	        type: 'basic',
	        iconUrl: '../images/extension-icon48.png',
	        title: 'Data saved',
	        message: message
	     }, (notificationId: String)=> {});
    });
}


/**
 * Opens OneTab Main Page
 */
function openExcitedGemPage ():void {
	if(_oneTabPageOpened == null){
    	chrome.tabs.create({url: onetabURL, pinned: true},
    		(tab: Object)=> {
	        	_oneTabPageOpened = tab.id;
	        	chrome.tabs.onUpdated.addListener((tabId: Number , info: Object)=> {
	        		if (info.status == "complete") sendTabsToContent();
	    		});//onCreated
        	});//Create Tab
	}
	else {
		chrome.tabs.update(_oneTabPageOpened, {selected: true},function(){
			streamTabs(ActiveTabsConnection);
		});//If OneTab Page is opened ,brings focus to it.
	}
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */
function setTabCountInBadge(tabId: String , info: Object):void{
	chrome.tabs.query({
	    currentWindow: true
	}, (tabs: Object[])=>{
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
function getAllTabs(windowId?: Number = chrome.windows.WINDOW_ID_CURRENT,returnType?: String = "all"):Object[]{
    chrome.tabs.query(
    {
    	// windowId: windowId
    },
    	(tabs: Object[])=> {
    		let stillLoading: bolean;
    		stillLoading = false;
    		for (let tab of tabs) {
			  if(tab.status == 'loading'){
			  	stillLoading = true;
			  	break;
			  }
			}
			if(stillLoading) {
				setTimeout(function(){
					getAllTabs(windowId, returnType);
				},1000);
			}
			else{
				allTabs = tabs;
    			refinedTabs = santizeTabs(tabs,ignoredUrlPatterns);
			}
    		
    });
    // console.log("getAllTabs Return:", allTabs,refinedTabs);
   	if(returnType == "all") {return allTabs;} else {return refinedTabs;}
}
/**
 * Remove tab objects from tab array based on ignore group
 * @param  {Array of Objects} tabs               [description]
 * @param  {Array} ignoredUrlPatterns [description]
 * @return {Array of Object}   Returns neat array after removing ignored urls
 */
function santizeTabs(tabs: Object[] , ignoredUrlPatterns: String[]):Object[]{
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

function sendTabsToContent ():void {
	sendToContent("tabsList",getAllTabs());
}
/**
 * [listAllTabs description]
 * @return {[type]} [description]
 */
function sendToContent (datavariable: String, data:Object[]):void {
	let obj: Object = {};
	obj[datavariable] = data;
	// packageAndBroadcast(sender,"content","drawTabs",obj);
}
chrome.runtime.onInstalled.addListener(()=>console.log("onInstalled")));
// chrome.tabs.onCreated.addListener(()=>console.log("onCreated"));
chrome.tabs.onRemoved.addListener(()=>console.log("onRemoved"));
chrome.tabs.onDetached.addListener(()=>console.log("onDetached"));
chrome.tabs.onAttached.addListener(()=>console.log("onAttached"));
chrome.tabs.onUpdated.addListener(()=>console.log("onUpdated"));
/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
function onUpdate (functions: Function) {
	chrome.runtime.onInstalled.addListener(functions)
	// chrome.tabs.onCreated.addListener(functions);
	chrome.tabs.onRemoved.addListener(functions);
	// chrome.tabs.onDetached.addListener(functions);
	chrome.tabs.onAttached.addListener(functions);
	chrome.tabs.onUpdated.addListener(functions);
}
// onUpdate(()=>{
// 	if(_oneTabPageOpened)
// 		chrome.tabs.reload(_oneTabPageOpened);
// })

function getTabsInRequestedWindowAndPost(tabId, info){
	chrome.windows.getCurrent({populate:true}, function(window){
		log(window);
		ActiveTabsConnection.postMessage({tabs : window.tabs});
	});
}
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
onUpdate(function(){
	streamTabs(ActiveTabsConnection);
})
onUpdate(setTabCountInBadge);
chrome.runtime.onInstalled.addListener(()=>{
	streamTabs(ActiveTabsConnection);
})

chrome.runtime.onInstalled.addListener(function(){

	 chrome.storage.sync.get("readinglists", function (items) {
        readinglists = items.readinglists;
        createReadingListMenu(readinglists);
    }
} )
/**
 * On clicking extension button
 */
chrome.browserAction.onClicked.addListener((tab: Object)=> {
    openExcitedGemPage();
});
chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((newState: String)=>{
	if(newState == 'idle'){
		console.log("idle");
	}
});
function tabToList (tabId: Number):void {
	chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, (tabs: Object[])=> {
    // and use that tab to fill in out title and url
    let tab = tabs[0];
    sendToContent("tabsList",tab);
});
}
function runQuery(query){
	let query = 'table#searchResult tbody td';
	chrome.runtime.sendMessage(query);
	return query;
}


/**
 * Creating Context Menus
 */
chrome.contextMenus.removeAll();

function createReadingListMenu(data){
	for(let i=0;i<data.length; i++){
		let id = String(data[i].id);
		let name = data[i].name;
		console.log("id:",id,'name:',name);
		chrome.contextMenus.create({
			"parentId": "showreadinglists",
			"id":  id,
		    "title": name,
		    "onclick" : function(){}
		});
		chrome.contextMenus.create({
			"parentId": "addreadinglists",
			"id": id+"create",
		    "title": name,
		    "onclick" : function(){}
		});
	}
	
	console.log("menu",data);
}

chrome.contextMenus.create({
    "title": "Refresh Main Page",
    "onclick" : function(){streamTabs(ActiveTabsConnection);}
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
    "onclick" : openExcitedGemPage
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

chrome.tabs.onUpdated.addListener((tabId: Number , info: Object)=> {
    if (info.status == "complete") {
    	log(tabId.title,"complete");
    	streamTabs(ActiveTabsConnection);
    	// sendTabsToContent();

    }
});//onCreated

 chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });


function saveSession(data) {
    e.preventDefault();
      let session = {};
    session.last = data;
    chrome.storage.sync.set({
        session: session
    }, function () {
        
    });
  
}
 chrome.windows.onRemoved.addListener(function(windowId){
	chrome.windows.get(windowId,{populate:true,windowTypes:['normal']}, function(window){
		// ActiveTabsConnection.postMessage({tabs : window.tabs});
		saveSession(window.tabs);
	});
 });