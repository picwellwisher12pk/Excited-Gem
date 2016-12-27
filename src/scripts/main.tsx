var editorExtensionId = "pedjggjdpdaimmieaihgkdikiafmhccc";
chrome.runtime.sendMessage(editorExtensionId, {openUrlInEditor: url},
  function(response) {
    if (!response.success)
      handleError(url);
  });
  
function loadIframe() {
    $(".iframe-window").attr("src", $(".website-url-input").val());
}
$(document).ready(function () {
    $('.load-website-btn').on('click', function (e) {
        loadIframe();
    }).on('keyup', function (e) {
        if (e.keyCode == 13)
            loadIframe();
    });
});
