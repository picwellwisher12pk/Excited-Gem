export function compareURL(a, b) {
    if (a.url < b.url)
        return -1;
    if (a.url > b.url)
        return 1;
    return 0;
}

export function compareTitle(a, b) {
    if (a.title.toLowerCase() < b.title.toLowerCase())
        return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase())
        return 1;
    return 0;
}

// Warn if overriding existing method
if (Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l = this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        } else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}


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
export function objectToArray(array, property) {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i][property]);
    }
    return newArray;
}
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
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
// module.exports = general;
export function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}


export function getCurrentURL() {
    let currentURL = "";
    currentURL = window.location.pathname;
    if (currentURL.indexOf('session') > -1) {
        return "sessions";
    }
    if (currentURL.indexOf('options') > -1) {
        return "options";
    }
    if (currentURL.indexOf('tabs') > -1) {
        return "tabs";
    }
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

function sortTabs(head, type) {
    var type = type;
    var head = head;
    let prevTabs = tabsList;
    let prevTabsArray;
    let tabsListArray;
    let loopFinished;
    setTimeout(function() {
        if (type == 'url') tabsList.sort(compareURL);
        if (type == 'title') tabsList.sort(compareTitle);
        // console.log(tabsList[i].title);
        data = { 'position': head, "tabId": tabsList[head].id }
        packageAndBroadcast(sender, 'background', 'moveTab', data);
        if (type == 'url') {
            tabsListArray = propertyToArray(tabsList, 'url');
            prevTabsArray = propertyToArray(prevTabs, 'url');
        }
        if (type == 'title') {
            tabsListArray = propertyToArray(tabsList, 'title');
            prevTabsArray = propertyToArray(prevTabs, 'title');
        }
        head++;
        if (head < tabsList.length) {
            sortTabs(head, type);
        }
        loopFinished = true;
        let sameArray = arraysAreIdentical(prevTabsArray, tabsListArray);

        if (sameArray) {
            console.log(sameArray, prevTabsArray, tabsListArray);
            return;
        }

        if (!sameArray && loopFinished) {
            console.log(sameArray, "=", tabsListArray, '=', prevTabsArray);
            head = 0;
            sortTabs(head, type);
        }
    }, pref.sortAnimation)

}