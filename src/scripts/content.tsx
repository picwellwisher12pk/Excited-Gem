let windowHeight: number;
let sender: string = 'content';
let tabsList;
let ActiveTabs :[] ; //React Component

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
    chrome.runtime.onConnect.addListener(function(port){
            
            console.assert(port.name == "ActiveTabsConnection");
            if (port.name == "ActiveTabsConnection") {
                port.onMessage.addListener(function(msg) {
                    console.log("msg",msg);
                    if(!jQuery.isEmptyObject(msg))
                     {
                         tabsList = msg.tabs;
                         ActiveTabs.setState({data: msg.tabs});
                     }
                });
            }
    });

////READING LISTS
    let itemGroup : []; //variable to stores data for React Component
    let ReadingLists : []; //React Component
    let readinglistsCounter: number;

    function get_readinglists(){
        chrome.storage.sync.get("readinglists", function (items) {
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
    get_readinglists();
    console.log("after getting readinglist",itemGroup);
    function set_readinglists(data){
         chrome.storage.sync.set({readinglists: data}, function (){
             console.log('Saving readinglists');
             readinglistsCounter++;
             ReadingLists.setState({data:itemGroup});
         });
    }

////GENERAL OPTIONS/CONFIGURATIONS
    let pref = {
        filterType : '',
        filterCase : false
    }
    function get_options() {
        chrome.storage.sync.get("pref", function (items) {
            pref.filterType = items.pref.filterType;
            pref.filterCase = items.pref.filterCase;
            $(".option-case-sensitive input").prop("checked":pref.filterCase);
            
            if(pref.filterType =="regex"){
                $(".option-regex input").prop("checked":true);
            }
            else{
                $(".option-regex input").prop("checked":false);
            }
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
    function compare(a,b) {
      if (a.url < b.url)
        return -1;
      if (a.url > b.url)
        return 1;
      return 0;
    }

//////////////////////////////////////////////////////////////////
$(document).ready(function(){
    packageAndBroadcast(sender,'background','documentready',null); //Tells background page when front-page's DOM is ready to start communication
    get_options();
    get_readinglists();
    ReadingLists = ReactDOM.render(<ReadingLists />, document.getElementById('readinglists-tab');
    ActiveTabs = ReactDOM.render(<ActiveTabs />,document.getElementById('active-tabs-list-container'));
    InfoModal = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
    ReadingLists.setState({data:itemGroup});
   
    
    $( ".sortable" ).sortable();
    $( ".sortable" ).disableSelection();

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      e.target // newly activated tab
      e.relatedTarget // previous active tab
      if($(e.targetMethod).prop('href') == '#readinglists'){
            get_readinglists();
          console.log("tab activated",e.target);
      }
    })

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

    $('#filter-type-option-id').on('change',function(){
        if($(this).prop('checked')){
            pref.filterType = "regex";
        }else{
            pref.filterType = "normal";            
        }
       
         chrome.storage.sync.set({pref: pref}, function (){
             console.log('saving');
         })
    });

    $('#filterCase-option-id').on('change',function(){
        pref.filterCase = $(this).prop('checked');
       
        chrome.storage.sync.set({pref: pref}, function (){
             console.log('saving');
         })
    });

    $("#rearrange-btn").on('click',function(){
        tabsList.sort(compare);
        // ActiveTabs.setState({data: tabsList});
        for(let i=0;i<tabsList.length;i++)
        {
             data = { 'position': i, "tabId": tabsList[i].id }
            packageAndBroadcast(sender,'background','moveTab',data);
        }
        
    });
   


    chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
    console.log(request);
    if(request.receiver == "content") {
        eval(request.targetMethod)(request.data);
    }
    return true;
});

    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
    let tempList;

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

    // })
    createQueryResultaTable();

    document.querySelector('#go-to-options').addEventListener('click',function() {
      if (chrome.runtime.openOptionsPage) {
        // New way to open options pages, if supported (Chrome 42+).
        chrome.runtime.openOptionsPage();
      } else {
        // Reasonable fallback.
        window.open(chrome.runtime.getURL('options.html'));
      }
    });
   

});
////////////////////////////////////////////////////////////////////

// document.addEventListener('click', function(e) {
//     if (hasClass(e.target, 'remove-tab')) {
//         console.log(e.target);

//     }
// }, false);
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

// function drawTabs(data){
//     tabsList = data.tabsList;
//   // console.info("Drawing Tabs");
//   ActiveTabs.setState({data: data.tabsList});

// }
