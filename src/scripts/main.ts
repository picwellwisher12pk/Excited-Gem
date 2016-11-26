// chrome.browserAction.setBadgeBackgroundColor({color:"#000"});

// bgWindow  = chrome.extension.getBackgroundPage();
// chrome.browserAction.setBadgeText({
// 	text : bgWindow.totalTabs()
// 	}); 
function loadIframe(){
	$(".iframe-window").attr("src", $(".website-url-input").val());
}
$(document).ready(function(){
	$('.load-website-btn').on('click',function(e){
		loadIframe();
	}).on('keyup',function(e){
		if(e.keyCode == 13) loadIframe();
	});
});


