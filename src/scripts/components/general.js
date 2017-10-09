let general = {
    hasClass: function(elem, className) {
        return elem.className.split(' ').indexOf(className) > -1;
    },
    getCurrentURL: function() {
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

}

function compareURL(a, b) {
    if (a.url < b.url)
        return -1;
    if (a.url > b.url)
        return 1;
    return 0;
}

function compareTitle(a, b) {
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
export function objectToArray(array, property): array {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        newArray.push(array[i][property]);
    }
    return newArray;
}
//Takes an array of object and make an plain array out of for a given property
export function propertyToArray(array, property): array {
    objectToArray(array, property);
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });
// module.exports = general;

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