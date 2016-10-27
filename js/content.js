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
	    	console.log(property, data[property]);
			el.data(property,data[property]);
	    }
	}
}


var tabsList =[];
console.log("ContentScript");
chrome.runtime.onMessage.addListener(function(request, sender) {
	console.log("getting message inside contentscript");
    tabsList = request.tabsList;
    // console.log(request);
    $.each(tabsList, function( index, value ) {
    	// console.log(value);
      img = $("<img/>");
      img.prop("src",value.favIconUrl)
	  a = $("<a></a>")
	  a.html(value.title)
	  a.prop("href",value.url);

	  li = $("<li></li>");
	  li.addClass('list-group-item');
	  data2DOM(li,value);

	  console.log("li.data",li.data());

	  a.prepend(img);
	  li.append(a);
	  $("ul.tabs-list").append(li);
	});
});