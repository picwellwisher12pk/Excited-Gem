let url  = 'test';
let ActiveTabs :[] ; //React Component
let editorExtensionId = "pedjggjdpdaimmieaihgkdikiafmhccc";

  
function loadIframe() {
    $(".iframe-window").attr("src", $(".website-url-input").val());
}
$(document).ready(function () {
  ActiveTabs = ReactDOM.render(<ActiveTabs />,document.getElementById('active-tabs-list-container'));
  chrome.runtime.sendMessage(editorExtensionId, {openUrlInEditor: url},
  function(response) {
     console.log(response.msg);
      ActiveTabs.setState({data: response.msg});
  });
    $('.load-website-btn').on('click', function (e) {
        loadIframe();
    }).on('keyup', function (e) {
        if (e.keyCode == 13)
            loadIframe();
    });
});
