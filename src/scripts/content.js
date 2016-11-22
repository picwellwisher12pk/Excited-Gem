function onRemove(e) {
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
$(document).ready(function () {
    $('.tabs-list-container').on('click', '.remove-tab', function (e) {
        onRemove(e);
        console.log("remove tab btn clicked");
    });
});
function enlistTabs(data) {
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
        list.append(item);
    });
    return list;
}
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
