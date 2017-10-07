function packagedData(sender,receiver,targetMethod,data){
	let packaged  = {
		sender: sender,
		receiver: receiver,
		targetMethod:targetMethod,
		data: data
	};
 	return packaged;
}

function packagedAndBroadcast(sender = sender,receiver,targetMethod,data){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id,
                                            packagedData(sender,receiver,targetMethod,data));
        });

}
// let portName ;
// chrome.runtime.onConnect.addListener(function(port){
//         console.assert(port.name == "ActiveTabsConnection");
//         if (port.name == "ActiveTabsConnection") {
//             port.postMessage({tabs : getAllTabs});
//         }
//     });
function setIncStorage( storagekey , newdata , arrayName ) {
  chrome.storage.local.get([storagekey], function(result) {
        var object = result[storagekey] ? result[storagekey] : null;

        object.push(newdata);

        var jsonObj = {};
        jsonObj[storagekey] = object;
        chrome.storage.local.set(jsonObj, function() {
            console.log("Saved a new array item");
        });
    });
}
function matchKeys(property,keysToRemove){
  for(let i = 0;i<keysToRemove.length; i++){
        if(property == keysToRemove[i]) return true;
  }
}
function removeKeys(keysToRemove,object){
  tempObject = new Object();
  for(let property in object){
    if(matchKeys(property,keysToRemove)) continue;
    tempObject[property] = object[property];
  }
  // console.log(tempObject);
  return tempObject;

}
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

chrome.runtime.onMessage.addListener((request, sender) => {
	log(request,sender);
	if(request.receiver == "background") eval(request.targetMethod)(request.data);
});

let allSessions = {
	// sessions
};
let _oneTabPageOpened = null;
let onetabURL  = chrome.extension.getURL("tabs.html");
let allTabs;

let refinedTabs ;

let ignoredUrlPatterns = [
"chrome://*",
"chrome-extension://*",
"http(s)?://localhost*"
];

// let ignoredDataKeys: Array<String> = ['url','favIconUrl','title'];
let ignoredDataKeys: Array<String> = ['active',"autoDiscardable", "discarded", "height", "highlighted", "id", "index", "selected", "status", "width", "windowId"];
let _development: Boolean = true;
let sender="background";

/**
 * Logging only for development environment
 * @param  {[type]} input  [description]
 * @param  {[type]} input2 [description]
 */
function log(input,input2?){
	if (_development) console.log(input,input2);
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
// function highlightTab(tabId){
// 	tabId =  parseInt(tabId);
// 	chrome.tabs.update(tabId, {active: true});
// }
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


/**
 * Opens OneTab Main Page
 */
function openExcitedGemPage () {
	if(_oneTabPageOpened == null){
    	chrome.tabs.create({url: onetabURL, pinned: true},
    		(tab)=> {
	        	_oneTabPageOpened = tab.id;
	        	chrome.tabs.onUpdated.addListener((tabId , info)=> {
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
function setTabCountInBadge(tabId , info){
	chrome.tabs.query({
	    currentWindow: true
	}, (tabs)=>{
		chrome.browserAction.setBadgeText({
		text : tabs.length
		});
	});
}

/**
 * [getAllTabs description]
 * @param  {Number} windowId   [Default to current window id -2]
 * @param  {String} returnType all | refined
 * @return {[type]}            [description]
 */
function getAllTabs(windowId? = chrome.windows.WINDOW_ID_CURRENT,returnType? = "all"){
    chrome.tabs.query(
    {
    	// windowId: windowId
    },
    	(tabs)=> {
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
function santizeTabs(tabs , ignoredUrlPatterns){
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

function sendTabsToContent () {
	sendToContent("tabsList",getAllTabs());
}
/**
 * [listAllTabs description]
 * @return {[type]} [description]
 */
function sendToContent (datavariable, data) {
	let obj = {};
	obj[datavariable] = data;
	// packagedAndBroadcast(sender,"content","drawTabs",obj);
}
chrome.runtime.onInstalled.addListener(
                                       ()=>console.log("onInstalled")
);
// chrome.tabs.onCreated.addListener(()=>console.log("onCreated"));
chrome.tabs.onRemoved.addListener(()=>console.log("onRemoved"));
chrome.tabs.onDetached.addListener(()=>console.log("onDetached"));
chrome.tabs.onAttached.addListener(()=>console.log("onAttached"));
chrome.tabs.onUpdated.addListener(()=>console.log("onUpdated"));
/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
function onUpdate (functions) {
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
	 chrome.storage.local.get(
        "readinglists",
        function (items) {
          readinglists = items.readinglists;
          createReadingListMenu(readinglists);
        }
    );
});
/**
 * On clicking extension button
 */
chrome.browserAction.onClicked.addListener((tab)=> {
    openExcitedGemPage();
});
chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener((newState)=>{
	if(newState == 'idle'){
		console.log("idle");
	}
});
function tabToList (tabId) {
	chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
}, (tabs)=> {
    // and use that tab to fill in out title and url
    let tab = tabs[0];
    sendToContent("tabsList",tab);
});
}
/*function runQuery(query){
	let query = 'table#searchResult tbody td';
	chrome.runtime.sendMessage(query);
	return query;
}*/


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
		    "onclick" (){}
		});
		chrome.contextMenus.create({
			"parentId": "addreadinglists",
			"id": id+"create",
		    "title": name,
		    "onclick" (){}
		});
	}

	console.log("menu",data);
}

chrome.contextMenus.create({
    "title": "Refresh Main Page",
    "onclick" (){streamTabs(ActiveTabsConnection);}
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

chrome.tabs.onUpdated.addListener((tabId , info)=> {
    if (info.status == "complete") {
    	log(tabId.title,"complete");
    	streamTabs(ActiveTabsConnection);
    	// sendTabsToContent();

    }
});//onCreated

 chrome.commands.onCommand.addListener(function(command) {
        console.log('Command:', command);
      });

//Use timestamp as names to save sessions. and before saving look if tabs in current sessions are already saved in last session
//if yes then don't save session. and alert. Tabs from curent session already exist in previously saved session.
function saveSessions() {
   chrome.windows.getAll({populate:true}, function(windows){
	   	let session = {
			   created : new Date(),
			   modified : null,
			   name : '',
			   windows : []
		   };

		for(var i=0;i<windows.length;i++){
      console.log("saveSession background",windows[i].tabs); //Array of Objects
      let windowsTab = [];
      for (let j =0; j< windows[i].tabs.length;j++){
              windowsTab.push(removeKeys(ignoredDataKeys,windows[i].tabs[j]));
      }
			session.windows[i] = windowsTab;
		}
		setIncStorage('sessions',session,"sessions");
		// chrome.storage.local.set(allSessions, ()=> {
  //   		chrome.notifications.create('reminder', {
		// 		type: 'basic',
		// 		iconUrl: '../images/extension-icon48.png',
		// 		title: 'Data saved',
		// 		message: "Session Saved"
		// 		}, (notificationId)=> {});
  //   	});


		packagedAndBroadcast(sender,'content','get_sessions',null)
	});

}
