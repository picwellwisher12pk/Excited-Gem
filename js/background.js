var _oneTabPageOpened = null;
var allTabs;

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
    onetabURL  = chrome.extension.getURL("onetab.html");
    /**
     * Getting All tabs
     */
    chrome.tabs.query({currentWindow: true	}, 
    	function(tabs) {		
    		allTabs = tabs;
    		console.log("alltabs within tabquery");
    }); 
    /**
     * Creating new tab and opening the oneTab Extension's main page in it if it not opened yet
     * Otherwise bring focus on the onetab Main page.
     */
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

});