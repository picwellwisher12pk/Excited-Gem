var _oneTabPageOpened = null; //Null or Id of OneTab Main Page
var onetabURL = chrome.extension.getURL("onetab.html");
var allTabs; //All tabs including Ignored Group
var refinedTabs; //Not including the Ignored Group
var ignoredUrlPatterns = [
    "chrome://*",
    "chrome-extension://*",
    "http(s)?://localhost*"
];
var ignoredDataKeys = ['url', 'favIconUrl', 'title'];
var _development = true;
/**
 * Messaging Beacon between content and Background js
 * @param  {[type]} request [description]
 * @param  {[type]} sender) {               tabsList [description]
 * @return {[type]}         [description]
 */
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
/**
 * Logging only for development environment
 * @param  {[type]} input  [description]
 * @param  {[type]} input2 [description]
 */
function log(input, input2) {
    if (_development)
        console.log(input, input2);
}
/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
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
/**
 * Opens OneTab Main Page
 */
function openOneTabPage() {
    if (_oneTabPageOpened == null) {
        chrome.tabs.create({ url: onetabURL, pinned: true }, function (tab) {
            _oneTabPageOpened = tab.id;
            chrome.tabs.onUpdated.addListener(function (tabId, info) {
                if (info.status == "complete")
                    sendTabsToContent();
            }); //onCreated
        }); //Create Tab
    }
    else {
        chrome.tabs.update(_oneTabPageOpened, { selected: true }, sendTabsToContent); //If OneTab Page is opened ,brings focus to it.
    }
}
/**
 * Sets badge label to Tabs count
 * @param {Integer} tabId     [description]
 * @param {Object} info [description]
 */
function setTabCountInBadge(tabId, info) {
    chrome.tabs.query({
        currentWindow: true
    }, function (tabs) {
        chrome.browserAction.setBadgeText({
            text: String(tabs.length)
        });
    });
}
/**
 * [getAllTabs description]
 * @param  {Number} windowId   [Default to current window id -2]
 * @param  {String} returnType all | refined
 * @return {[type]}            [description]
 */
function getAllTabs(windowId, returnType) {
    if (windowId === void 0) { windowId = chrome.windows.WINDOW_ID_CURRENT; }
    if (returnType === void 0) { returnType = "all"; }
    console.log("windowID", chrome.windows.WINDOW_ID_CURRENT);
    chrome.tabs.query({}, function (tabs) {
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
/**
 * Remove tab objects from tab array based on ignore group
 * @param  {Array of Objects} tabs               [description]
 * @param  {Array} ignoredUrlPatterns [description]
 * @return {Array of Object}   Returns neat array after removing ignored urls
 */
function santizeTabs(tabs, ignoredUrlPatterns) {
    refinedTabs = tabs.filter(function (tab) {
        var patLength = ignoredUrlPatterns.length;
        var url = tab.url;
        var pattern = new RegExp(ignoredUrlPatterns.join("|"), "i");
        var matched = url.match(pattern) == null;
        // log(url,pattern,matched);
        return (matched);
    });
    return refinedTabs;
}
function reSendTabsToContent() {
    getAllTabs();
    // sendToContent();
    sendTabsToContent();
}
function sendTabsToContent(data) {
    if (data === void 0) { data = allTabs; }
    getAllTabs();
    sendToContent("tabsList", data);
}
/**
 * [listAllTabs description]
 * @return {[type]} [description]
 */
function sendToContent(datavariable, data) {
    var obj = {};
    obj[datavariable] = data;
    chrome.runtime.sendMessage(obj);
}
/**
 * Running setTabCountInBage when the Chrome Extension is installed ,a tab is created, removed , attached or detached.
 */
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
/**
 * On clicking extension button
 */
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
        // and use that tab to fill in out title and url
        var tab = tabs[0];
        sendToContent("tabsList", tab);
    });
}
function runQuery(query) {
    var query = 'table#searchResult tbody td';
    chrome.runtime.sendMessage(query);
    return query;
}
/**
 * Creating Context Menus
 */
chrome.contextMenus.create({
    "title": "Refresh Main Page",
    "onclick": reSendTabsToContent
});
chrome.contextMenus.create({
    "title": "Send Current tab to list",
    "onclick": tabToList
});
// chrome.contextMenus.create({
//     "title": "Refresh Main Page including Ignored",
//     "onclick" : sendToContent(true),
//   });
chrome.contextMenus.create({
    "title": "Show Excited Gem Page",
    "onclick": openOneTabPage
});
chrome.contextMenus.create({
    "title": "Run Query",
    "onclick": runQuery
});
