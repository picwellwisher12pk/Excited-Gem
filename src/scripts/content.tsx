// let  $ = require('jquery');
// import React from 'react';
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import {Board} from 'activetabs';
let windowHeight: number;
let sidebar: any;
let resultTable : any;
let results: any;
let sender: string = 'content';
let $grid: any;
let tabsList;
let ActiveTabs :[] ;
let filterType :string;
let filterType :boolean;

function restore_options() {
    chrome.storage.sync.get("pref", function (items) {
        filterType = items.pref.filterType;
        filterCase = items.pref.filterCase;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);


///QUERY
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
////TABS
function onRemove(e:any){
		// let e = new Array(e);
		e = e.target;
		if(e != undefined) {
	        let id = e.dataset.id;
	        requestCloseTab(id);
	        $(e).parents('.list-group-item').remove();
	    }
}
function requestCloseTab(data) {
    let confirmation = window.confirm("Are you sure you want to close this tab");
    if (confirmation) packageAndBroadcast( sender ,'background','closeTab',data);
}
function hasClass(elem, className) {
    return elem.className.split(' ').indexOf(className) > -1;
}


//////////////////////////////////////////////////////////////////
$(document).ready(function(){

     ActiveTabs = ReactDOM.render(<ActiveTabs />,
            document.getElementById('active-tabs-list-container'));

    windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	
    let tempList;

    $('#quicksearch-input').on('keyup',(e)=>{
        tempList = tabsList.filter((tab)=>
        {
            if(filterType === "regex"){
                let regex = new RegExp(e.target.value,filterCase?"i":"");
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
    // manageQueryResultTable(results);



    // $("html").on("contextmenu",function(e){
    //            //prevent default context menu for right click
    //            // e.preventDefault();

    //            var menu = $(".menu");

    //            //hide menu if already shown
    //            menu.hide();

    //            //get x and y values of the click event
    //            var pageX = e.pageX;
    //            var pageY = e.pageY;

    //            //position menu div near mouse cliked area
    //            menu.css({top: pageY , left: pageX});

    //            var mwidth = menu.width();
    //            var mheight = menu.height();
    //            var screenWidth = $(window).width();
    //            var screenHeight = $(window).height();

    //            //if window is scrolled
    //            var scrTop = $(window).scrollTop();

    //            //if the menu is close to right edge of the window
    //            if(pageX+mwidth > screenWidth){
    //                menu.css({left:pageX-mwidth});
    //            }

    //            //if the menu is close to bottom edge of the window
    //            if(pageY+mheight > screenHeight+scrTop){
    //                menu.css({top:pageY-mheight});
    //            }

    //            //finally show the menu
    //            menu.show();
    //     });

    //     $("html").on("click", function(){
    //         $(".menu").hide();
    //     });

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
function drawTabs(data){
    tabsList = data.tabsList;
  console.info("Drawing Tabs");
  ActiveTabs.setState({data: data.tabsList});

}
