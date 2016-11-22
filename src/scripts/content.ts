function onRemove(e){
		// let e = new Array(e);
		e = e.target;
		if(e != undefined) {
			console.log("before",$(e).parents('ul').find('li'));
	        let id = e.dataset.id;
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
    let confirmation = window.confirm("Are you sure you want to close this tab");
    if (confirmation) chrome.runtime.sendMessage({ closeTab: data });
}

$(document).ready(function(){
	$('.tabs-list-container').on('click','.remove-tab',function(e){
		onRemove(e);
	console.log("remove tab btn clicked");
	});

});


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
    let list = $("<ul/>");
    list.addClass('tabs-list list-group');
    $.each(data, function(index, value) {
        options = $("<div class='options pull-right'></div>");
        let pinned = $("<span class='disabled glyphicon glyphicon-pushpin' aria-hidden='true'></span>");
        let audible = $("<span class='disabled glyphicon glyphicon-volume-off' aria-hidden='true'></span>");
        img = $("<img src='" + value.favIconUrl + "'/>");
        item = $("<li><a href='"+value.url+"' title='"+value.title+"' target='_blank'>" + value.title + "</a></li>")
        if (value.pinned) pinned = $("<span class='glyphicon glyphicon-pushpin' aria-hidden='true'></span>");
        if (value.audible) audible = $("<span class='glyphicon glyphicon-volume-up' aria-hidden='true'></span>");
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
    for (let property in data) {
        if (property == ignoredKeys[0] || property == ignoredKeys[1] || property == ignoredKeys[2]) continue;
        if (data.hasOwnProperty(property)) {
            el.data(property, data[property]);
        }
    }
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    url = chrome.extension.getURL("/_generated_background_page.html");
    if (sender.url == url) {
        console.log(location);
        console.log("getting from background", request, sender);
        tabsList = request.tabsList;
        tabsList = enlistTabs(tabsList);
        $('.tabs-list-container').html(tabsList);
        delete tabsList;
        
    } else {
        // Content script code
    }

});
