import packagedAndBroadcast from './communications.js';
let _development = true;
let client =  process.env.browser == 'firefox' ? browser : chrome;
export let homepageURL = client.extension.getURL('tabs.html');
let allTabs;
let refinedTabs;
let allSessions = {
  // sessions
};
let ignoredUrlPatterns = ['chrome://*', 'chrome-extension://*', 'http(s)?://localhost*'];
let ignoredDataKeys = [
  'active',
  'autoDiscardable',
  'discarded',
  'height',
  'highlighted',
  'id',
  'index',
  'selected',
  'status',
  'width',
  'windowId',
];
let sortDelay = 250;
export function compareURL(a, b) {
  console.log('URL', a.url.slice(1, 30), b.url.slice(1, 30));
  if (a.url < b.url) return -1;
  if (a.url > b.url) return 1;
  return 0;
}

export function compareTitle(a, b) {
  if (a.title.toLowerCase() < b.title.toLowerCase()) return -1;
  if (a.title.toLowerCase() > b.title.toLowerCase()) return 1;
  return 0;
}

export function matchKeys(property, keysToRemove) {
  for (let i = 0; i < keysToRemove.length; i++) {
    if (property == keysToRemove[i]) return true;
  }
}
export function removeKeys(keysToRemove, object) {
  var tempObject = new Object();
  for (let property in object) {
    if (matchKeys(property, keysToRemove)) continue;
    tempObject[property] = object[property];
  }
  return tempObject;
}

/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
export function saveData(data, message = 'Data saved') {
  client.storage.local.set(data, () => {
    client.notifications.create(
      'reminder',
      {
        type: 'basic',
        iconUrl: '../images/extension-icon48.png',
        title: 'Data saved',
        message: message,
      },
      notificationId => {}
    );
  });
}
// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = array => {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] != array[i]) {
      // Warning - two different object instances will never be equal: {x:20} != {x:20}
      return false;
    }
  }
  return true;
};

export function arraysAreIdentical(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
}

//Takes an array of object and make an plain array out of for a given property
// export function objectToArray(array, property) {
//     let newArray = [];
//     for (let i = 0; i < array.length; i++) {
//         newArray.push(array[i][property]);
//     }
//     return newArray;
// }
// //Takes an array of object and make an plain array out of for a given property
// export function propertyToArray(array, property) {
//     objectToArray(array, property);
// }
//Takes an array of object and make an plain array out of for a given property
export function propertyToArray(array, property) {
  let newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push(array[i][property]);
  }
  return newArray;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });
// module.exports = general;
export function hasClass(elem, className) {
  return elem.className.split(' ').indexOf(className) > -1;
}

// export function getCurrentURL() {
//   let currentURL = '';
//   currentURL = window.location.pathname;
//   if (currentURL.indexOf('session') > -1) {
//     return 'sessions';
//   }
//   if (currentURL.indexOf('options') > -1) {
//     return 'options';
//   }
//   if (currentURL.indexOf('tabs') > -1) {
//     return 'tabs';
//   }
// }
export function log(input, input2?) {
  if (_development) console.log(input, input2);
}
// export function highlightCurrentNavLink() {
//   var currentPage = getCurrentURL();
//   if (currentPage == 'tabs') $('ul.nav.navbar-nav li.tabs').toggleClass('active');
//   if (currentPage == 'options') $('ul.nav.navbar-nav li.options').toggleClass('active');
//   if (currentPage == 'sessions') $('ul.nav.navbar-nav li.sessions').toggleClass('active');
// }

export function timeConverter(UNIX_timestamp) {
  var date = new Date(UNIX_timestamp);
  var options = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  };
  return date.toLocaleDateString('en-US', options);
}

// Hide method from for-in loops
Object.defineProperty(Array.prototype, 'equals', { enumerable: false });

let quicksort = function(array, sortby) {
  // console.log('quickSort', array, sortby);
  if (array.length <= 1) return array;
  // if (sortby == 'url') sort = url;
  // if (sortby == 'title') sort = title;
  var pivot = array[0];
  var left = [];
  var right = [];
  for (var i = 1; i < array.length; i++) {
    array[i][sortby] < pivot[sortby] ? left.push(array[i]) : right.push(array[i]);
  }
  return quicksort(left, sortby).concat(pivot, quicksort(right, sortby));
};

export function sortTabs(type, tabsList) {
  // let prevTabs = tabsList;
  tabsList = quicksort(tabsList, type);
  for (let i = 0; i < tabsList.length; i++) {
    let { id } = tabsList[i];
    setTimeout(() => {
      client.tabs.move(id, { index: i });
    }, sortDelay);
  }
}
/*function runQuery(query){
  let query = 'table#searchResult tbody td';
  browser.runtime.sendMessage(query);
  return query;
}*/
export function tabToList(tabId) {
  browser.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    tabs => {
      // and use that tab to fill in out title and url
      let tab = tabs[0];
      sendToContent('tabsList', tab);
    }
  );
}

export function sendTabsToContent() {
  sendToContent('tabsList', getAllTabs());
}
/**
 * [listAllTabs description]
 * @return {[type]} [description]
 */
function sendToContent(datavariable, data) {
  let obj = {};
  obj[datavariable] = data;
  // packagedAndBroadcast(sender,"content","drawTabs",obj);
}

function tabToList(tabId) {
  browser.tabs.query(
    {
      active: true,
      lastFocusedWindow: true,
    },
    tabs => {
      // and use that tab to fill in out title and url
      let tab = tabs[0];
      sendToContent('tabsList', tab);
    }
  );
}

/**
 * Remove tab objects from tab array based on ignore group
 * @param  {Array of Objects} tabs               [description]
 * @param  {Array} ignoredUrlPatterns [description]
 * @return {Array of Object}   Returns neat array after removing ignored urls
 */
export function santizeTabs(tabs, ignoredUrlPatterns) {
  refinedTabs = tabs.filter(tab => {
    let patLength = ignoredUrlPatterns.length;
    ignoredUrlPatterns;
    let url = tab.url;
    let pattern = new RegExp(ignoredUrlPatterns.join('|'), 'i');
    let matched = url.match(pattern) == null;
    // log(url,pattern,matched);
    return matched;
  });
  return refinedTabs;
}

/**
 * [getAllTabs description]
 * @param  {Number} windowId   [Default to current window id -2]
 * @param  {String} returnType all | refined
 * @return {[type]}            [description]
 */
export function getAllTabs(homepageOpened, returnType = 'all') {
  browser.tabs.query(
    {
      // windowId: homepageOpened.windowId
    },
    tabs => {
      let stillLoading = false;
      for (let tab of tabs) {
        if (tab.status == 'loading') {
          stillLoading = true;
          break;
        }
      }
      if (stillLoading) {
        setTimeout(() => getAllTabs(homepageOpened, returnType), 1000);
      } else {
        allTabs = tabs;
        refinedTabs = santizeTabs(tabs, ignoredUrlPatterns);
      }
    }
  );
  // log("getAllTabs Return:", allTabs,refinedTabs);
  if (returnType == 'all') {
    return allTabs;
  } else {
    return refinedTabs;
  }
}

export function streamTabs(homepageOpened, port) {
  if (port == undefined) return;
  port.postMessage({ tabs: getAllTabs(homepageOpened) });
  // log(getAllTabs(homepageOpened), port);
}
export function searchInTabs(searchTerm, originalData, searchType = 'regex', searchCase = '', searchBy = null) {
  console.log("general.js:searchInTabs",searchTerm,originalData);
  return originalData.filter(tab => {
    if (searchType == 'regex') {
      let regex = new RegExp(searchTerm, searchCase);
      if (regex.test(tab.title)) return true;
      if (regex.test(tab.url)) return true;
    } else {
      return tab.title.indexOf(searchTerm) >= 0;
    }
  });
}
