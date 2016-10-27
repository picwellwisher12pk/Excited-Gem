function setTabCountInBadge(dataAndEvents,deepDataAndEvents){
	chrome.tabs.query({
	    currentWindow: true
	}, function(tabs) {
		chrome.browserAction.setBadgeText({
		text : String(tabs.length)
		}); 
	});
}
chrome.runtime.onInstalled.addListener(setTabCountInBadge)
chrome.tabs.onCreated.addListener(setTabCountInBadge);
chrome.tabs.onRemoved.addListener(setTabCountInBadge);
chrome.tabs.onMoved.addListener(setTabCountInBadge);
chrome.tabs.onDetached.addListener(setTabCountInBadge);
chrome.tabs.onAttached.addListener(setTabCountInBadge);


