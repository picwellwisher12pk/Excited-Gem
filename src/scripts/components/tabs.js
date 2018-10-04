let selectTab = (number) => {
  if (number < 0) number = 0;
  $('.eg .tabs-list.list-group li.list-group-item').removeClass('selected');
  $('.eg .tabs-list.list-group').find('li.list-group-item:nth(' + number + ')').addClass('selected');
  selectedTabIndex = number;
}

let renderTabs = () => {
  if (window.location.pathname.indexOf('tabs') > -1) {
    chrome.runtime.onConnect.addListener(function(port) {
        // console.assert(port.name == "ActiveTabsConnection");
        if (port.name == "ActiveTabsConnection") {
          port.onMessage.addListener(function(msg) {
            // console.log("msg", msg);
            activeTabsCount = msg.tabs.length;
            $('.active-tab-counter').text("(" + activeTabsCount + ")");
            if (!jQuery.isEmptyObject(msg)) {
              tabsList = msg.tabs;
              $('.active-tab-count').html(msg.tabs.length);
              ActiveTabs.setState({ data: msg.tabs });
              selectTab(1);
            }
          });
        }
      })
    }
}
function sortTabs(head, type) {
    // var type = type;
    // let head = head;
    let prevTabs = tabsList;
    let prevTabsArray;
    let tabsListArray;
    let loopFinished;
    setTimeout(function() {
      if (type == 'url') tabsList.sort(compareURL);
      if (type == 'title') tabsList.sort(compareTitle);
      // console.log(tabsList[i].title);
      data = { 'position': head, "tabId": tabsList[head].id }
      packageAndBroadcast(sender, 'background', 'moveTab', data);
      if (type == 'url') {
        tabsListArray = propertyToArray(tabsList, 'url');
        prevTabsArray = propertyToArray(prevTabs, 'url');
      }
      if (type == 'title') {
        tabsListArray = propertyToArray(tabsList, 'title');
        prevTabsArray = propertyToArray(prevTabs, 'title');
      }
      head++;
      if (head < tabsList.length) {
        sortTabs(head, type);
      }
      loopFinished = true;
      let sameArray = arraysAreIdentical(prevTabsArray, tabsListArray);

      if (sameArray) {
        console.log(sameArray, prevTabsArray, tabsListArray);
        return;
      }

      if (!sameArray && loopFinished) {
        console.log(sameArray, "=", tabsListArray, '=', prevTabsArray);
        head = 0;
        sortTabs(head, type);
      }
    }, pref.sortAnimation)
   }
