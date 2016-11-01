var onetabURL  = chrome.extension.getURL("onetab.html");
var _oneTabPageOpened = null;
var allTabs;
/**
 * Opens OneTab Main Page
 * @return {[type]} [description]
 */
function openOneTabPage () {
	if(_oneTabPageOpened == null){
    	chrome.tabs.create({url: onetabURL, pinned: true},
    		function(tab)
    		{
	        	_oneTabPageOpened = tab.id;
	        	chrome.tabs.onUpdated.addListener(function(tabId , info) 
	        	{
	        		if (info.status == "complete"){
	    				chrome.runtime.sendMessage({tabsList: allTabs});
	    			}
	    		});//onCreated
        	});//Create Tab
	}
	else {
		chrome.tabs.update(_oneTabPageOpened, {selected: true});
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
	}, function(tabs) {
		chrome.browserAction.setBadgeText({
		text : String(tabs.length)
		}); 
	});
}
/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
chrome.runtime.onInstalled.addListener(setTabCountInBadge)
chrome.tabs.onCreated.addListener(setTabCountInBadge);
chrome.tabs.onRemoved.addListener(setTabCountInBadge);
chrome.tabs.onDetached.addListener(setTabCountInBadge);
chrome.tabs.onAttached.addListener(setTabCountInBadge);

/**
 * On clicking extension button
 */
chrome.browserAction.onClicked.addListener(function(tab) {
	/**
	 * URL of onetab main page
	 * @type {String}
	 */
    /**
     * Getting All tabs
     */
    chrome.tabs.query({currentWindow: true	}, 
    	function(tabs) {		
    		allTabs = tabs;
    		console.log("alltabs within tabquery");
    }); 
    openOneTabPage();
    

});

chrome.contextMenus.create({
    "title": "Tab it",
    "id": "1",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : clickHandler
  });
chrome.contextMenus.create({
    "title": "Buzz This",
    "id": "2",
    "onclick" : clickHandler,
    "parentId": "1"
  });


 function clickHandler(){
 	return ;
 }