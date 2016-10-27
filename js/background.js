chrome.tabs.query({
    currentWindow: true
}, function(tabs) {
	chrome.browserAction.setBadgeText({
	text : String(tabs.length)
	}); 
});


