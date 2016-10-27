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
/**
 * [saveData description]
 * @param  {String/Object/Array} data    [description]
 * @param  {String} message [description]
 */
function saveData (data, message) {
	chrome.storage.sync.set(data, function() {
    	chrome.notifications.create('reminder', {
	        type: 'basic',
	        iconUrl: '../images/extension-icon48.png',
	        title: 'Data saved',
	        message: message
	     }, function(notificationId) {});
    });
}
chrome.runtime.onMessage.addListener(function(request, sender) {
    tabsList = request.tabsList;
    $.each(tabsList, function( index, value ) {
	  saveData(value, "Tabs Saved");
      img = $("<img src='"+value.favIconUrl+"'/>");
	  a = $("<a>"+value.title+"</a>")
	  a.addClass('list-group-item')
	  a.prop({"href":value.url,"target":"_blank","draggable": true});
	  data2DOM(a,value);
	  a.prepend(img);
	  $(".tabs-list").append(a);
	});
	
});