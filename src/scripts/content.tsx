let windowHeight: number;
let sender: string = 'content';
let tabsList;
let ActiveTabs :[] ; //React Component
let activeTabsCount;
let selectedTabIndex;

////MESSAGING AND COMMUNICATION
  function packageData(sender:string,receiver:string,targetMethod:String,data: any): Object{
      let package :Object = {
          sender: sender,
          receiver: receiver,
          targetMethod:targetMethod,
          data: data
      };
       return package;
  }

  function packageAndBroadcast(sender:string = sender,receiver:string,targetMethod:String,data: any){
          chrome.runtime.sendMessage(packageData(sender,receiver,targetMethod,data));
  }
  if(window.location.pathname.indexOf('tabs') > -1) chrome.runtime.onConnect.addListener(function(port){

          console.assert(port.name == "ActiveTabsConnection");
          if (port.name == "ActiveTabsConnection") {
              port.onMessage.addListener(function(msg) {
                  console.log("msg",msg);
                  activeTabsCount = msg.tabs.length;
                  $('.active-tab-counter').text("("+activeTabsCount+")");
                  if(!jQuery.isEmptyObject(msg))
                   {
                       tabsList = msg.tabs;
                       $('.active-tab-count').html(msg.tabs.length);

                         ActiveTabs.setState({data: msg.tabs});
                         selectTab(1);

                   }
              });
          }
  });
///Selection

  function selectTab(number){
    if(number < 0) number = 0;
    $('.eg .tabs-list.list-group li.list-group-item').removeClass('selected');
    $('.eg .tabs-list.list-group').find('li.list-group-item:nth('+number+')').addClass('selected');
    selectedTabIndex = number;
  }

////READING LISTS
  let itemGroup : []; //variable to stores data for React Component
  let ReadingLists : []; //React Component
  let readinglistsCounter: number;

  function get_readinglists(){
      chrome.storage.local.get("readinglists", function (items) {
          console.log("Getting Reading list",items);
          itemGroup = items.readinglists;
          if(items.readinglists == undefined){
               itemGroup = [];
               readinglistsCounter = 0;
          }else{
              itemGroup = items.readinglists;
              readinglistsCounter = items.readinglists.length;
          }
          return items.readinglists;
          ReadingLists.setState({data:itemGroup});
      }
  }

  let allSessions;
   function get_sessions(){
      chrome.storage.local.get("sessions", function (items) {
          allSessions = items.sessions;
          console.log("get all sessions",allSessions);
          Sessions.setState({data:allSessions});
          return items.sessions;
      }
  }
  get_readinglists();
  function set_readinglists(data){
       chrome.storage.local.set({readinglists: data}, function (){
           console.log('Saving readinglists');
           readinglistsCounter++;
           ReadingLists.setState({data:itemGroup});
       });
  }

////GENERAL OPTIONS/CONFIGURATIONS
  let pref = {
      filterType : '',
      filterCase : false,
      sortAnimation : 250;
  }
  function getOptions() {
      chrome.storage.local.get("pref", function (items) {
          pref.filterType = items.pref.filterType;
          pref.filterCase = items.pref.filterCase;
          pref.sortAnimation = items.pref.sortAnimation;
          $(".option-case-sensitive input").prop("checked":pref.filterCase);

          if(pref.filterType =="regex"){
              $(".option-regex input").prop("checked":true);
          }
          else{
              $(".option-regex input").prop("checked":false);
          }
      });
  }
  function getLastSession(){
      chrome.storage.local.get("session", function (items) {
          console.log(items.session);
      });
  }

////QUERY
  let sidebar: any;
  let resultTable : any;
  let results: any;
  function query(queryString: string = 'table#searchResult tbody td'){
      console.log($(queryString));
      $('.eg_results_table').empty();
      return $(queryString);
  }
  function createQueryResultaTable(){
      let sidebar = $("<div/>");
      sidebar.addClass('eg_sidebar');
      $('body').append(sidebar);
      sidebar.css({
          'position':'fixed', 'width': '400px', 'height': windowHeight, 'min-height': '700px',
          'background': 'white',
          'overflow-y': 'scroll',
          'right':"-400px",
          'top':'0',
          'box-shadow':'0 0 10px 0 #000',
          'z-index': '9999'
      });
      let queryinput = $('<input type="text" placeholder="Insert your query here" class="query-input" style="width: 100%;padding: 10px; margin-bottom: 15px;"/>');
      sidebar.append(queryinput);
      queryinput.on('keyup',function(e){
          if (e.keyCode == 13){
              let queryString = queryinput.val();
              results = query(queryString);
              manageQueryResultTable(results);
          }
      });
      resultTable = $(`<table class="eg_results_table table table-bordered"></table>`);
      sidebar.append(resultTable);
      return resultTable;
  }

  function manageQueryResultTable(results: any[]){
      $.each(results,function(index,value){
          // let name = $(value).find('.detName a').text();
          // let url = $(value).find('> a').first().attr('href');
          let tr = $('<tr/>');
          resultTable.append(tr);
          let tableRow = `<td>${index+1}</td><td>${value.outerHTML}</td>`;
          tr.append(tableRow);

      });
  }

  function requestCloseTab(data) {
      let confirmation = window.confirm("Are you sure you want to close this tab");
      if (confirmation) packageAndBroadcast( sender ,'background','closeTab',data);
  }
  function hasClass(elem, className) {
      return elem.className.split(' ').indexOf(className) > -1;
  }
  function compareURL(a,b) {
    if (a.url < b.url)
      return -1;
    if (a.url > b.url)
      return 1;
    return 0;
  }
  function compareTitle(a,b) {
    if (a.title.toLowerCase() < b.title.toLowerCase())
      return -1;
    if (a.title.toLowerCase() > b.title.toLowerCase())
      return 1;
    return 0;
  }
    // Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}

function arraysAreIdentical(arr1, arr2){
    if (arr1.length !== arr2.length) return false;
    for (var i = 0, len = arr1.length; i < len; i++){
        if (arr1[i] !== arr2[i]){
            return false;
        }
    }
    return true;
}
//Takes an array of object and make an plain array out of for a given property
function propertyToArray(array, property):array{
    let newArray = [];
    for(let i=0;i<array.length;i++){
        newArray.push(array[i][property]);
    }
    return newArray;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});
    function sortTabs (head,type) {
        let type = type;
        let head = head;
        let prevTabs = tabsList;
        let prevTabsArray;
        let tabsListArray;
        let loopFinished: boolean;
           setTimeout(function () {
            if(type == 'url') tabsList.sort(compareURL);
            if(type == 'title') tabsList.sort(compareTitle);
            // console.log(tabsList[i].title);
            data = { 'position': head, "tabId": tabsList[head].id }
            packageAndBroadcast(sender,'background','moveTab',data);
             if(type == 'url') {
                 tabsListArray = propertyToArray(tabsList,'url');
                 prevTabsArray = propertyToArray(prevTabs,'url');
             }
             if(type == 'title') {
                 tabsListArray = propertyToArray(tabsList,'title');
                 prevTabsArray = propertyToArray(prevTabs,'title');
             }
              head++;
              if (head < tabsList.length) {
                 sortTabs(head,type);
              }
              loopFinished = true;
              let sameArray =  arraysAreIdentical(prevTabsArray,tabsListArray);

              if(sameArray) {
                  console.log(sameArray,prevTabsArray,tabsListArray);
                  return;}

              if(!sameArray && loopFinished){
                  console.log(sameArray,"=",tabsListArray,'=',prevTabsArray);
                  head = 0;
                  sortTabs(head,type);
              }
           }, pref.sortAnimation)

        }
//////////////////////////////////////////////////////////////////
$(document).ready(function(){
    let currentPage = "";
    let currentURL = window.location.pathname;
    if(currentURL.indexOf('session') > -1){
        currentPage = "sessions";
    }
    if(currentURL.indexOf('options') > -1){
        currentPage = "options";
    }
    if(currentURL.indexOf('tabs') > -1){
        currentPage = "tabs";
    }
    packageAndBroadcast(sender,'background','documentready',null); //Tells background page when front-page's DOM is ready to start communication
    $('.active-tab-counter').text(activeTabsCount);
    $(document).keyup('.eg .tabs-list li.list-group-item button.site-name',function(e){
      packageAndBroadcast(sender,"background","focusTab",$(this).parent().attr('id'));
    })
    //Section responsible for selecting tab based on up and down arrow key press
    $(document).keydown(function(e){
      console.log(e.key,e.which,e.code);
      if(e.which == 40){
        console.log(selectedTabIndex,$('.eg .tabs-list li').length);
        if(selectedTabIndex >= $('.eg .tabs-list li').length) {
          selectTab($('.eg .tabs-list li').length-1);
        }else if (selectedTabIndex < $('.eg .tabs-list li').length-1)
        {
          selectTab(selectedTabIndex+1);
        }
      }
      if(e.which == 36){ //Home
        selectTab(0);
      }
      if(e.which == 35){ //End
        selectTab($('.eg .tabs-list li').length-1);
      }
      if(e.which == 38){
        selectTab(selectedTabIndex-1);
      }
      if(e.which == 13){ //focus tab on Enter
        let id = $('.eg .tabs-list li.list-group-item:nth('+selectedTabIndex+')').attr('data-id');
        packageAndBroadcast(sender,"background","focusTab",id);
      }
      if (e.which == 46) {
        let id = $('.eg .tabs-list li.list-group-item:nth('+selectedTabIndex+')').attr('data-id');
        if(confirm('Are you sure you want to close the following this Tab'))
            {packageAndBroadcast(sender,"background","closeTab",id);}
      }
    }
    getLastSession();
    get_readinglists();
   // Instance the tour

    let tempList;

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      e.target // newly activated tab
      e.relatedTarget // previous active tab
      if($(e.targetMethod).prop('href') == '#readinglists'){
            get_readinglists();
          console.log("tab activated",e.target);
      }
    });
    //Search/Filter
    $('#quicksearch-input').on('keyup',(e)=>{
        tempList = tabsList.filter((tab)=>
        {
            if(pref.filterType === "regex"){
                let regex = new RegExp(e.target.value,pref.filterCase?"i":"");
                return regex.test(tab.title);
            }
            else{
                return tab.title.indexOf(e.target.value) >= 0;
            }
        });
            ActiveTabs.setState({data:tempList});
    });
     $('#filter-type-option-id').on('change',function(){
        if($(this).prop('checked')){
            pref.filterType = "regex";
        }else{
            pref.filterType = "normal";
        }

         chrome.storage.local.set({pref: pref}, function (){
             console.log('saving');
         })
    });

    $('#filterCase-option-id').on('change',function(){
        pref.filterCase = $(this).prop('checked');

        chrome.storage.local.set({pref: pref}, function (){
             console.log('saving');
         })
    });

    //Page Detection
    if (currentPage == "tabs") {
      ActiveTabs = ReactDOM.render(<ActiveTabs />,document.getElementById('active-tabs-list-container'));
      InfoModal = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
      $("ul.nav.navbar-nav li.tabs").toggleClass('active');
    }
    if (currentPage == "sessions") {
      get_sessions();
      Sessions = ReactDOM.render(<Sessions />,document.getElementById('all-sessions'));
      $("ul.nav.navbar-nav li.sessions").toggleClass('active');
    }

    if (currentPage == "options") {
      getOptions();
      $("ul.nav.navbar-nav li.options").toggleClass('active');
    }

    //Reading List
    $('#create-new-readinglist').on('click',function(){
        readlinglistname = prompt("Enter name for your reading list");
        console.log(readlinglistname);
        let readinglist= {};
        readinglist.id = readinglistsCounter;
        readinglist.name = readlinglistname;
        itemGroup.push(readinglist);
        packageAndBroadcast(sender,'background','createReadingListMenu',itemGroup);
        if(readlinglistname) {
           set_readinglists(itemGroup);
           $('#tablist a[href="#readinglists"]').tab('show');

        }

    });

    $('#refreshActiveTabs').on('click',function(){
        packageAndBroadcast(sender,'background','getTabsInRequestedWindowAndPost',null);
    });
    $("#rearrange-title-btn").on('click',function(){
        var i = 0;
        sortTabs(i,'title');
    });
    $("#rearrange-url-btn").on('click',function(){
        var i = 0;
        sortTabs(i,'url');
    });
    $("#saveSessions-btn").on('click',function(e){
        e.preventDefault();
        packageAndBroadcast(sender,'background','saveSessions',null);
    });
    $("#saveSessionsAndClose-btn").on('click',function(){
        packageAndBroadcast(sender,'background','saveSessionsAndClose',null);
    });
    chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
    console.log(request);
    if(request.receiver == "content") {
        eval(request.targetMethod)(request.data);
    }

    return true;
});

    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;



    // })
    createQueryResultaTable();

    // document.querySelector('#go-to-options').addEventListener('click',function() {
    //   if (chrome.runtime.openOptionsPage) {
    //     // New way to open options pages, if supported (Chrome 42+).
    //     chrome.runtime.openOptionsPage();
    //   } else {
    //     // Reasonable fallback.
    //     window.open(chrome.runtime.getURL('options.html'));
    //   }
    // });



});
////////////////////////////////////////////////////////////////////

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
