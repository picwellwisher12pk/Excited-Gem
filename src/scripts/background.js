var _oneTabPageOpened = null;
var onetabURL = chrome.extension.getURL("onetab.html");
var allTabs;
var refinedTabs;
var ignoredUrlPatterns = [
    "chrome://*",
    "chrome-extension://*",
    "http(s)?://localhost*"
];
var ignoredDataKeys = ['url', 'favIconUrl', 'title'];
var _development = true;
chrome.runtime.onMessage.addListener(function (request, sender) {
    var url = chrome.extension.getURL("/onetab.html");
    if (sender.url == url) {
        chrome.tabs.remove(parseInt(request.closeTab), function () {
            chrome.tabs.query({}, function (tabs) {
                allTabs = tabs;
                refinedTabs = santizeTabs(tabs, ignoredUrlPatterns);
            });
        });
    }
});
function log(input, input2) {
    if (_development)
        console.log(input, input2);
}
function saveData(data, message) {
    if (message === void 0) { message = "Data saved"; }
    chrome.storage.sync.set(data, function () {
        chrome.notifications.create('reminder', {
            type: 'basic',
            iconUrl: '../images/extension-icon48.png',
            title: 'Data saved',
            message: message
        }, function (notificationId) { });
    });
}
function openOneTabPage() {
    if (_oneTabPageOpened == null) {
        chrome.tabs.create({ url: onetabURL, pinned: true }, function (tab) {
            _oneTabPageOpened = tab.id;
            chrome.tabs.onUpdated.addListener(function (tabId, info) {
                if (info.status == "complete") {
                    sendTabsToContent;
                }
            });
        });
    }
    else {
        chrome.tabs.update(_oneTabPageOpened, { selected: true }, sendTabsToContent);
    }
}
function setTabCountInBadge(tabId, info) {
    chrome.tabs.query({
        currentWindow: true
    }, function (tabs) {
        chrome.browserAction.setBadgeText({
            text: String(tabs.length)
        });
    });
}
function getAllTabs(windowId, returnType) {
    if (returnType == undefined)
        returnType = "all";
    if (windowId == undefined)
        windowId = chrome.windows.WINDOW_ID_CURRENT;
    chrome.tabs.query({
        windowId: windowId
    }, function (tabs) {
        allTabs = tabs;
        refinedTabs = santizeTabs(tabs, ignoredUrlPatterns);
    });
    console.log("getAllTabs Return:", allTabs, refinedTabs);
    if (returnType == "all") {
        return allTabs;
    }
    else {
        return refinedTabs;
    }
}
function santizeTabs(tabs, ignoredUrlPatterns) {
    refinedTabs = tabs.filter(function (tab) {
        var patLength = ignoredUrlPatterns.length;
        var url = tab.url;
        var pattern = new RegExp(ignoredUrlPatterns.join("|"), "i");
        var matched = url.match(pattern) == null;
        return (matched);
    });
    return refinedTabs;
}
function reSendTabsToContent() {
}
function sendTabsToContent(data) {
    if (data === void 0) { data = allTabs; }
    getAllTabs();
    sendToContent("tabsList", data);
}
function sendToContent(datavariable, data) {
    var obj = {};
    obj[datavariable] = data;
    chrome.runtime.sendMessage(obj);
}
function onUpdate(functions) {
    chrome.runtime.onInstalled.addListener(functions);
    chrome.tabs.onCreated.addListener(functions);
    chrome.tabs.onRemoved.addListener(functions);
    chrome.tabs.onDetached.addListener(functions);
    chrome.tabs.onAttached.addListener(functions);
}
onUpdate(setTabCountInBadge);
onUpdate(getAllTabs);
chrome.runtime.onInstalled.addListener(function () {
    getAllTabs();
    sendTabsToContent();
});
chrome.browserAction.onClicked.addListener(function (tab) {
    openOneTabPage();
});
chrome.idle.setDetectionInterval(30);
chrome.idle.onStateChanged.addListener(function (newState) {
    if (newState == 'idle') {
        console.log("idle");
    }
});
function tabToList(tabId) {
    chrome.tabs.query({
        active: true,
        lastFocusedWindow: true
    }, function (tabs) {
        var tab = tabs[0];
        sendToContent("tabsList", tab);
    });
}
chrome.contextMenus.create({
    "title": "Refresh Main Page",
    "onclick": reSendTabsToContent
});
chrome.contextMenus.create({
    "title": "Send Current tab to list",
    "onclick": tabToList
});
chrome.contextMenus.create({
    "title": "Show Excited Gem Page",
    "onclick": openOneTabPage
});
