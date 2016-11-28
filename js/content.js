var windowHeight;
var sidebar;
var resultTable;
var results;
var sender = 'content';
var $grid;
var qsRegex;
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
        var id = e.dataset.id;
        requestCloseTab(id);
        $(e).parents('.list-group-item').remove();
    }
}
function requestCloseTab(data) {
    var confirmation = window.confirm("Are you sure you want to close this tab");
    if (confirmation)
        packageAndBroadcast(sender, 'background', 'closeTab', data);
}
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}
function setUpIsotope() {
    $grid = $('.list-group').isotope({
        itemSelector: '.list-group-item',
        layoutMode: 'vertical',
        filter: function () {
            return qsRegex ? $(this).text().match(qsRegex) : "*";
        }
    });
    console.log("$grid", $grid);
}
function updateIsotope() {
    var $quicksearch = $('.quicksearch-input');
    qsRegex = new RegExp($quicksearch.val(), 'gi');
    $grid.isotope();
}
//////////////////////////////////////////////////////////////////
$(document).ready(function () {
    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    $('.tabs-list-container').on('click', '.remove-tab', function (e) {
        onRemove(e);
    });
    $('.tabs-list-container').on('click', '.list-group-item a', function (e) {
        var data = $(e.target).parents('li').attr('tab-id');
        packageAndBroadcast(sender, "background", "focusTab", data);
    });
    $('.tabs-list-container').on('click', '.list-group-item span.pinned', function (e) {
        var data = $(e.target).parents('li').attr('tab-id');
        if ($(this).hasClass("disabled")) {
            packageAndBroadcast(sender, "background", "pinTab", data);
        }
        else {
            packageAndBroadcast(sender, "background", "unpinTab", data);
        }
        $(this).toggleClass("disabled");
    });
    $('.tabs-list-container').on('click', '.list-group-item span.audible', function (e) {
        var data = $(e.target).parents('li').attr('tab-id');
        if ($(this).hasClass("disabled")) {
            packageAndBroadcast(sender, "background", "unmuteTab", data);
        }
        else {
            packageAndBroadcast(sender, "background", "muteTab", data);
        }
        $(this).toggleClass("disabled");
    });
    // $('.tabs-list-container').on('click','.list-group-item span.pinned',function(e){
    //     let data = $(e.target).parents('li').attr('tab-id');
    //     packageAndBroadcast(sender,"background","unpinTab",data);
    //     $(this).toggleClass("disabled");
    // });
    createQueryResultaTable();
    //     $('.list-group').isotope({
    //     // options
    //     itemSelector: '.list-group-item',
    //     layoutMode: 'fitRows'
    // });
    // quick search regex
    var qsRegex;
    // init Isotope
    // use value of search field to filter
    $('.quicksearch-btn').click(function () {
        updateIsotope();
    });
    // debounce so filtering doesn't happen every millisecond
    function debounce(fn, threshold) {
        var timeout;
        return function debounced() {
            if (timeout) {
                clearTimeout(timeout);
            }
            function delayed() {
                fn();
                timeout = null;
            }
            timeout = setTimeout(delayed, threshold || 100);
        };
    }
    // manageQueryResultTable(results);
    // $("html").on("contextmenu",function(e){
    //            //prevent default context menu for right click
    //            // e.preventDefault();
    //            var menu = $(".menu"); 
    //            //hide menu if already shown
    //            menu.hide(); 
    //            //get x and y values of the click event
    //            var pageX = e.pageX;
    //            var pageY = e.pageY;
    //            //position menu div near mouse cliked area
    //            menu.css({top: pageY , left: pageX});
    //            var mwidth = menu.width();
    //            var mheight = menu.height();
    //            var screenWidth = $(window).width();
    //            var screenHeight = $(window).height();
    //            //if window is scrolled
    //            var scrTop = $(window).scrollTop();
    //            //if the menu is close to right edge of the window
    //            if(pageX+mwidth > screenWidth){
    //                menu.css({left:pageX-mwidth});
    //            }
    //            //if the menu is close to bottom edge of the window
    //            if(pageY+mheight > screenHeight+scrTop){
    //                menu.css({top:pageY-mheight});
    //            }
    //            //finally show the menu
    //            menu.show();
    //     }); 
    //     $("html").on("click", function(){
    //         $(".menu").hide();
    //     });
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
        var pinned = $("<span class='disabled glyphicon glyphicon-pushpin pinned' aria-hidden='true'></span>");
        var audible = $("<span class='disabled glyphicon glyphicon-volume-off audible' aria-hidden='true'></span>");
        img = $("<img src='" + value.favIconUrl + "'/>");
        item = $("<li tab-id='" + value.id + "'><a title='" + value.title + "' target='_blank'>" + value.title + "</a></li>");
        if (value.pinned)
            pinned = $("<span class='glyphicon glyphicon-pushpin pinned' aria-hidden='true'></span>");
        if (value.audible)
            audible = $("<span class='glyphicon glyphicon-volume-up audible' aria-hidden='true'></span>");
        remove = $("<span data-id='" + value.id + "' data-command='remove' class='remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>");
        options.prepend(remove);
        item.addClass('list-group-item');
        item.prop({ 'draggable': true });
        data2DOM(item, value);
        item.prepend(img);
        item.prepend(pinned);
        item.prepend(audible);
        item.append(options);
        // remove.addEventListener('click',onRemove(event),false);
        list.append(item);
    });
    setUpIsotope();
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
