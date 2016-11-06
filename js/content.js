/**
 * Makes a HTML list of given data (Mainly for Tabs)
 * @param  {[type]} data [description]
 * @return {HTML Entity}      [description]
 */
function enlistTabs (data) {
	var list = $("<div/>");
	list.addClass('tabs-list list-group');
	$.each(data, function( index, value ) {
      img = $("<img src='"+value.favIconUrl+"'/>");
	  a = $("<a>"+value.title+"</a>")
	  a.addClass('list-group-item')
	  a.prop({"href":value.url,"target":"_blank","draggable": true});
	  data2DOM(a,value);
	  a.prepend(img);
	  list.append(a);
	});
	return list;

}
/**
 * Will attach data from Chrome tabs to HTML nodes to retreive later
 * @param  {Element} element [description]
 * @param  {Object} data    [description]
 */
function data2DOM(el,data){
	ignoredKeys = ['url','favIconUrl','title'];
	for (var property in data) {
		if (property == ignoredKeys[0] || property == ignoredKeys[1] || property == ignoredKeys[2]) continue;
	    if (data.hasOwnProperty(property)) {
			el.data(property,data[property]);
	    }
	}
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    tabsList = request.tabsList;
    console.log("reqest",request);
    console.log("tabs",tabsList);
    $('.tabs-list-container').append(tabsList);
});