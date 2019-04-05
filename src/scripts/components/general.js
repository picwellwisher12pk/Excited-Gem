let env = require('../../../utils/env');
var browser = require('webextension-polyfill');
window.development = env.NODE_ENV === 'development';
export let homepageURL = browser.extension.getURL('tabs.html');
let refinedTabs;

export let ignoredUrlPatterns = ['chrome://*', 'chrome-extension://*', 'http(s)?://localhost*'];
export let ignoredDataKeys = [
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
  log('URL', a.url.slice(1, 30), b.url.slice(1, 30));
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
  browser.storage.local.set(data, () => {
    browser.notifications.create(
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
export function setValue(object, path, value) {
  var a = path.split('.');
  var o = object;
  for (var i = 0; i < a.length - 1; i++) {
    var n = a[i];
    if (n in o) {
      o = o[n];
    } else {
      o[n] = {};
      o = o[n];
    }
  }
  o[a[a.length - 1]] = value;
}
export function getValue(object, path) {
  var o = object;
  path = path.replace(/\[(\w+)\]/g, '.$1');
  path = path.replace(/^\./, '');
  var a = path.split('.');
  while (a.length) {
    var n = a.shift();
    if (n in o) {
      o = o[n];
    } else {
      return;
    }
  }
  return o;
}
export function log() {
  let trace = false;
  if (window.development || window.debug) {
    console.group(arguments[0]);
    console.log(Array.prototype.slice.call(arguments));
    trace ? console.trace() : '';
    console.groupEnd();
  }
}
// export function log(){
//   log.history = log.history || [];   // store logs to an array for reference
//   log.history.push(arguments);
//   if(console){
//     log( Array.prototype.slice.call(arguments) );
//   }
// }

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

function quicksort(sortby, array) {
  log('quicksort array', array);
  if (array.length <= 1) return array;
  let pivot = array[0];
  let left = [];
  let right = [];
  for (let i = 1; i < array.length; i++) {
    array[i][sortby] < pivot[sortby] ? left.push(array[i]) : right.push(array[i]);
  }
  log('left:', left, 'right:', right);
  return quicksort(sortby, left).concat(pivot, quicksort(sortby, right));
}

export function sortTabs(sortby) {
  let tabsList = quicksort(sortby, window.tabs);
  log('after quicksort', tabsList);
  for (let i = 0; i < tabsList.length; i++) {
    let { id } = tabsList[i];
    setTimeout(() => {
      browser.tabs.move(id, { index: i });
    }, sortDelay);
  }
}
/*function runQuery(query){
  let query = 'table#searchResult tbody td';
  browser.runtime.sendMessage(query);
  return query;
}*/

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
