var windowHeight;
var sidebar;
var resultTable;
var results;
///QUERY
function query(queryString) {
    if (queryString === void 0) { queryString = 'table#searchResult tbody td'; }
    console.log($(queryString));
    $('.eg_results_table').empty();
    return $(queryString);
}
function createQueryResultaTable() {
    var sidebar = $("<div/>");
    sidebar.addClass('eg_sidebar');
    $('body').append(sidebar);
    sidebar.css({
        'position': 'fixed', 'width': '400px', 'height': windowHeight, 'min-height': '700px',
        'background': 'white',
        'overflow-y': 'scroll',
        'right': "-400px",
        'top': '0',
        'box-shadow': '0 0 10px 0 #000',
        'z-index': '9999'
    });
    var queryinput = $('<input type="text" placeholder="Insert your query here" class="query-input" style="width: 100%;padding: 10px; margin-bottom: 15px;"/>');
    sidebar.append(queryinput);
    queryinput.on('keyup', function (e) {
        if (e.keyCode == 13) {
            var queryString = queryinput.val();
            results = query(queryString);
            manageQueryResultTable(results);
        }
    });
    resultTable = $("<table class=\"eg_results_table table table-bordered\"></table>");
    sidebar.append(resultTable);
    return resultTable;
}
function manageQueryResultTable(results) {
    $.each(results, function (index, value) {
        // let name = $(value).find('.detName a').text();
        // let url = $(value).find('> a').first().attr('href');
        var tr = $('<tr/>');
        resultTable.append(tr);
        var tableRow = "<td>" + (index + 1) + "</td><td>" + value.outerHTML + "</td>";
        tr.append(tableRow);
    });
}
////TABS
function onRemove(e) {
    // let e = new Array(e);
    e = e.target;
    if (e != undefined) {
        console.log("before", $(e).parents('ul').find('li'));
        var id = e.dataset.id;
        requestCloseTab(id);
        $(e).parents('.list-group-item').remove();
        console.log($(e).parents('ul').find('li'));
    }
}
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}
function requestCloseTab(data) {
    console.log("requestCloseTab");
    var confirmation = window.confirm("Are you sure you want to close this tab");
    if (confirmation)
        chrome.runtime.sendMessage({ closeTab: data });
}
//////////////////////////////////////////////////////////////////
$(document).ready(function () {
    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    $('.tabs-list-container').on('click', '.remove-tab', function (e) {
        onRemove(e);
        console.log("remove tab btn clicked");
    });
    createQueryResultaTable();
    // manageQueryResultTable(results);
});
////////////////////////////////////////////////////////////////////
// document.addEventListener('click', function(e) {
//     if (hasClass(e.target, 'remove-tab')) {
//         console.log(e.target);
//     }
// }, false);
/**
 * Makes a HTML list of given data (Mainly for Tabs)
 * @param  {[type]} data [description]
 * @return {HTML Entity}      [description]
 */
function enlistTabs(data) {
    console.log(data);
    var list = $("<ul/>");
    list.addClass('tabs-list list-group');
    $.each(data, function (index, value) {
        options = $("<div class='options pull-right'></div>");
        var pinned = $("<span class='disabled glyphicon glyphicon-pushpin' aria-hidden='true'></span>");
        var audible = $("<span class='disabled glyphicon glyphicon-volume-off' aria-hidden='true'></span>");
        img = $("<img src='" + value.favIconUrl + "'/>");
        item = $("<li><a href='" + value.url + "' title='" + value.title + "' target='_blank'>" + value.title + "</a></li>");
        if (value.pinned)
            pinned = $("<span class='glyphicon glyphicon-pushpin' aria-hidden='true'></span>");
        if (value.audible)
            audible = $("<span class='glyphicon glyphicon-volume-up' aria-hidden='true'></span>");
        remove = $("<span data-id='" + value.id + "' data-command='remove' class='remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>");
        options.prepend(remove);
        item.addClass('list-group-item');
        item.prop({ "href": value.url, "target": "_blank", "draggable": true });
        data2DOM(item, value);
        item.prepend(img);
        item.prepend(pinned);
        item.prepend(audible);
        item.append(options);
        // remove.addEventListener('click',onRemove(event),false);
        list.append(item);
    });
    return list;
}
/**
 * Will attach data from Chrome tabs to HTML nodes to retreive later
 * @param  {Element} element [description]
 * @param  {Object} data    [description]
 */
function data2DOM(el, data) {
    ignoredKeys = ['url', 'favIconUrl', 'title'];
    for (var property in data) {
        if (property == ignoredKeys[0] || property == ignoredKeys[1] || property == ignoredKeys[2])
            continue;
        if (data.hasOwnProperty(property)) {
            el.data(property, data[property]);
        }
    }
}
chrome.runtime.onMessage.addListener(function (request, sender) {
    url = chrome.extension.getURL("/_generated_background_page.html");
    if (sender.url == url) {
        console.log(location);
        console.log("getting from background", request, sender);
        tabsList = request.tabsList;
        tabsList = enlistTabs(tabsList);
        $('.tabs-list-container').html(tabsList);
        delete tabsList;
    }
    else {
    }
});
