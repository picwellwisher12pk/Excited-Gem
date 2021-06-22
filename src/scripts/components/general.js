let env = require("../../../utils/env");
var browser = require("webextension-polyfill");
window.development = env.NODE_ENV === "development";
export let homepageURL = browser.extension.getURL("tabs.html");
let refinedTabs;

export let ignoredUrlPatterns = [
  "chrome://*",
  "chrome-extension://*",
  "http(s)?://localhost*",
];
export let ignoredDataKeys = [
  "active",
  "autoDiscardable",
  "discarded",
  "height",
  "highlighted",
  "id",
  "index",
  "selected",
  "status",
  "width",
  "windowId",
];
let sortDelay = 250;

export function compareURL(a, b) {
  log("URL", a.url.slice(1, 30), b.url.slice(1, 30));
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
    if (property === keysToRemove[i]) return true;
  }
}

export function removeKeys(keysToRemove, object) {
  var tempObject = {};
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
export function saveData(data, message = "Data saved") {
  browser.storage.local.set(data, () => {
    browser.notifications.create(
      "reminder",
      {
        type: "basic",
        iconUrl: "../images/extension-icon48.png",
        title: "Data saved",
        message: message,
      },
      (
        // notificationId
      ) => {
      }
    );
  });
}

// Warn if overriding existing method
if (Array.prototype.equals)
  console.warn(
    "Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code."
  );
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = (array) => {
  // if the other array is a falsy value, return
  if (!array) return false;

  // compare lengths - can save a lot of time
  if (this.length !== array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    // Check if we have nested arrays
    if (this[i] instanceof Array && array[i] instanceof Array) {
      // recurse into the nested arrays
      if (!this[i].equals(array[i])) return false;
    } else if (this[i] !== array[i]) {
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
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// module.exports = general;
export function hasClass2(elem, className) {
  return elem.className.split(" ").indexOf(className) > -1;
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
  var a = path.split(".");
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
  path = path.replace(/\[(\w+)\]/g, ".$1");
  path = path.replace(/^\./, "");
  var a = path.split(".");
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
    trace ? console.trace() : "";
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
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  return date.toLocaleDateString("en-US", options);
}

// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

function quicksort(sortby, array) {
  log("quicksort array", array);
  if (array.length <= 1) return array;
  let pivot = array[0];
  let left = [];
  let right = [];
  for (let i = 1; i < array.length; i++) {
    array[i][sortby] < pivot[sortby]
      ? left.push(array[i])
      : right.push(array[i]);
  }
  log("left:", left, "right:", right);
  return quicksort(sortby, left).concat(pivot, quicksort(sortby, right));
}

function hasClass(el, className) {
  if (el.classList) return el.classList.contains(className);
  return !!el.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
}

export function addClass(el, className) {
  if (el.classList) el.classList.add(className);
  else if (!hasClass(el, className)) el.className += " " + className;
}

export function removeClass(el, className) {
  if (el.classList) el.classList.remove(className);
  else if (hasClass(el, className)) {
    var reg = new RegExp("(\\s|^)" + className + "(\\s|$)");
    el.className = el.className.replace(reg, " ");
  }
}

export function sortTabs(sortby, tabs) {
  let tabsList = quicksort(sortby, tabs);
  log("after quicksort", tabsList);
  for (let i = 0; i < tabsList.length; i++) {
    let {id} = tabsList[i];
    setTimeout(() => {
      browser.tabs.move(id, {index: i});
    }, sortDelay);
  }
}

/*function runQuery(query){
  let query = 'table#searchResult tbody td';
  browser.runtime.sendMessage(query);
  return query;
}*/
export function santizeTabs(tabs, ignoredUrlPatterns) {
  refinedTabs = tabs.filter((tab) => {
    ignoredUrlPatterns;
    let url = tab.url;
    let pattern = new RegExp(ignoredUrlPatterns.join("|"), "i");
    // log(url,pattern,matched);
    return url.match(pattern) == null;
  });
  return refinedTabs;
}

// state = { ...props };
// state = {
//   selectedTabs: [],
//   allMuted: false,
//   allSelected: false,
//   allPinned: false,
// };

// closeTab = closeTab.bind(this);
// toggleMute = toggleMute.bind(this);
// isAllMuted = isAllMuted.bind(this);
// onDragEnd = onDragEnd.bind(this);
// updateSelectedTabs = updateSelectedTabs.bind(this);
// setPreferences = setPreferences.bind(this);
// processSelectedTabs = processSelectedTabs.bind(this);
// togglePin = togglePin.bind(this);

// componentDidMount(a, b) {
//   setState({ allMuted: isAllMuted() });
//   setState({ allPinned: isAllPinned() });
//   setState({ allSelected: isAllSelected() });
//   setState({ preferences: props.preferences });
// }

//Creating SelectedTabs status
// updateSelectedTabs(id, selected) {
//   let tempArray = props.selectedTabs;
//   !selected ? tempArray.splice(tempArray.indexOf(id), 1) : tempArray.push(id);
//   tempArray.length > 0
//     ? addClass(document.querySelector('#selection-action'), 'selection-active')
//     : removeClass(document.querySelector('#selection-action'), 'selection-active');
//   props.updateSelectedTabsAction(tempArray);
// }
// isAllSelected() {
//   for (let tab of props.tabs) {
//     if (!tab.checked) return false;
//   }
//   return true;
// }
//Close

//Pinned
// const pinTab = (tabId) => {
//   console.info("pinning");
//   browser.tabs.update(tabId, {pinned: true});
//   getTabs().then(
//     (tabs) => {
//       setState({tabs});
//     },
//     (error) => log(`Error: ${error}`)
//   );
// };
// const unpinTab = (tabId) => {
//   console.info("unpinning");
//   browser.tabs.update(tabId, {pinned: false});
//   getTabs().then(
//     (tabs) => {
//       setState({tabs});
//     },
//     (error) => log(`Error: ${error}`)
//   );
// };
// const togglePin = (tabId) => {
//   let tabTemp = props.tabs.filter((tab) => tab.id === tabId);
//   tabTemp[0].pinned ? unpinTab(tabId) : pinTab(tabId);
// };
// isAllPinned() {
//   for (let tab of props.tabs) {
//     if (!tab.pinned) return false;
//   }
//   return true;
// }
//Muted or Not
// muteTab(id) {
//   browser.tabs.update(parseInt(id), { muted: true });
// }
// unmuteTab(id) {
//   browser.tabs.update(parseInt(id), { muted: false });
// }
// const toggleMute = (id) => {
//   browser.tabs.get(id).then((tab) => {
//     browser.tabs.update(parseInt(id), {muted: !tab.mutedInfo.muted});
//   });
//   props.updateActiveTabs();
// };
// isAllMuted() {
//   // const tabs = props.tabs.then(tabs => tabs);
//   for (let tab of props.tabs) {
//     if (!tab.mutedInfo.muted) return false;
//   }
//   return true;
// }
// processSelectedTabs(action, selection = props.selectedTabs) {
//   switch (action) {
//     case 'closeSelected':
//       let message = 'Are you sure you want to close selected tabs';
//       if (selection.length === props.tabs.length)
//         message = 'Are you sure you want to close all the tabs? This will also close this window.';
//       if (!confirm(message)) return false;
//       for (let id of selection) closeTab(id, false);
//       setState({ selectedTabs: [] });
//       removeClass(document.querySelectorAll('#selection-action'), 'selection-active');
//       break;
//     case 'toNewWindow':
//       let targetWindow = browser.windows.create();
//       targetWindow.then(windowInfo => {
//         browser.tabs.move(selection, { windowId: windowInfo.id, index: 0 });
//       });
//       break;
//     case 'toSession':
//       saveTabs(selection.map(selectedTab => state.tabs.find(o => selectedTab === o.id)));
//       break;
//     case 'pinSelected':
//       for (let tab of selection) pinTab(tab);
//       break;
//     case 'unpinSelected':
//       for (let tab of selection) unpinTab(tab);
//       break;
//     case 'togglePinSelected':
//       for (let tab of selection) !tab.pinned ? pinTab(tab) : unpinTab(tab);
//       break;
//
//     //Mute
//     case 'muteSelected':
//       console.log('muting');
//       for (let tab of selection) muteTab(tab);
//       break;
//     case 'unmuteSelected':
//       for (let tab of selection) unmuteTab(tab);
//       break;
//     case 'toggleMuteSelected':
//       for (let tab of selection) !tab.mutedInfo.muted ? muteTab(tab) : unmuteTab(tab);
//       break;
//
//     //Selection
//     case 'selectAll':
//       setState({ selectedTabs: filterTabs().map(tab => tab.id) });
//       addClass(document.querySelectorAll('#selection-action'), 'selection-active');
//       break;
//     case 'selectNone':
//       setState({ selectedTabs: [] });
//       removeClass(document.querySelectorAll('#selection-action'), 'selection-active');
//       break;
//     case 'invertSelection':
//       let inverted = props.tabs.filter(tab => !props.selectedTabs.includes(tab.id)).map(tab => tab.id);
//       setState({ selectedTabs: inverted });
//       break;
//   }
// }
//

// setPreferences(prefSection, key, value) {
//   browser.storage.local.get('preferences').then(result => {
//     let jsonObj = result;
//     jsonObj['preferences'][prefSection][key] = value;
//     browser.storage.local.set(jsonObj).then(() => {
//       browser.notifications.create(
//         'reminder',
//         {
//           type: 'basic',
//           iconUrl: '../images/logo.png',
//           title: 'Settings Saved',
//           message: 'Search settings updated',
//         },
//         function(notificationId) {}
//       );
//     });
//   });
// }

export const asyncFilterTabs = async (
  {searchTerm, audibleSearch, pinnedSearch},
  {searchIn, ignoreCase, regex},
  tabs
) => {
  return await new Promise((resolve) => {
    if (searchTerm === "" && !audibleSearch && !pinnedSearch) return tabs;
    const filteredTabs = tabs?.filter(({title, url, audible, pinned}) => {
      const isAudible = audibleSearch ? audible === true : true;
      const isPinned = pinnedSearch ? pinned === true : true;
      if (regex) {
        try {
          let regexTest = new RegExp(searchTerm, ignoreCase ? "i" : "");
          if (searchIn[0] && regexTest.test(title) && isAudible && isPinned) return true;
          if (searchIn[1] && regexTest.test(url) && isAudible && isPinned) return true;
        } catch (error) {
          console.error("Search error:", error);
        }
      } else {
        if (searchIn[0] && !ignoreCase) return title.includes(searchTerm) && isAudible && isPinned;
        if (searchIn[0] && ignoreCase) return title.toLowerCase().includes(searchTerm.toLowerCase()) && isAudible && isPinned;
        if (searchIn[1]) return url.toLowerCase().includes(searchTerm.toLowerCase()) && isAudible && isPinned;
      }
    });
    resolve(filteredTabs);
  });
};
export const filterTabs = (
  searchTerm,
  {searchIn, ignoreCase, regex},
  tabs
) => {
  if (searchTerm === "") return tabs;
  return tabs.filter(({title, url}) => {
    if (regex) {
      try {
        let regexTest = new RegExp(searchTerm, ignoreCase ? "i" : "");
        if (searchIn[0] && regexTest.test(title)) return true;
        if (searchIn[1] && regexTest.test(url)) return true;
      } catch (error) {
        console.log("Search error:", error);
      }
    } else {
      if (searchIn[0] && ignoreCase)
        return title.toLowerCase().includes(searchTerm.toLowerCase());
      if (searchIn[0] && !ignoreCase) return title.includes(searchTerm);
      if (searchIn[1])
        return url.toLowerCase().includes(searchTerm.toLowerCase());
    }
  });
};

export const getMetrics = (compName, mode, actualTime, baseTime) => {
  // requestAnimationFrame(() => {
  //   document.getElementById("demo").innerText = `
  //    ComponnentId: ${compName}
  //    Mode:         ${mode}
  //    BaseTime:     ${baseTime}
  //    ActualTime:   ${actualTime}
  //   `;
  // });
  console.log(compName, mode, actualTime, baseTime);
};

export function updateTabs(getTabs, store) {
  getTabs().then((tabs) => {
    store.dispatch(updateActiveTabs(tabs));
  });
}
