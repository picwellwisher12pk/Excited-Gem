var tabsList =[];
console.log("ContentScript");
chrome.runtime.onMessage.addListener(function(request, sender) {
	console.log("getting message inside contentscript");
    tabsList = request.tabsList;
    $.each(tabsList, function( index, value ) {
	  console.log(index, value);
	});
});