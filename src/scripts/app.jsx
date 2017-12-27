//Scripts and Modules

//Vendors
require( 'jquery');
require('bootstrap');
import React from "react";
import ReactDOM from "react-dom";

//JS components
import packagedAndBroadcast from "./components/communications.js";
import * as general from "./components/general.js";
import selectTab from "./components/tabSelection.js";
// require("./components/general.js");

// React Components
import ActiveTabs from "./react-components/tabs.rc.jsx";
import InfoModal from "./react-components/info-modal.rc.jsx";
// import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import "../styles/bootstrap.scss";
import "../styles/eg.scss";

import "../images/extension-icon16.png";
import "../images/extension-icon48.png";
import "../images/extension-icon128.png";
import "../images/icon38.png";
import "../images/icon19.png";
import "../images/arrange.svg";
import "../images/close-icon.svg";
import "../images/info-icon.svg";
import "../images/pin-icon.svg";
import "../images/reload-icon.svg";
import "../images/search-icon.svg";
import "../images/sound-icon.svg";

//Declarations
let windowHeight;
const sender = "content";
let tabsList;
let Tabs;
let infoModal;
let activeTabsCount;
let currentPage = "";
let pref = {
    filterType : "regex",
    filterCase : "true"
};


$(document).ready(function() {
    // getReadingLists();

    general.highlightCurrentNavLink();
    currentPage = general.getCurrentURL();

    packagedAndBroadcast(sender, 'background', 'documentready', null); //Tells background page when front-page's DOM is ready to start communication
    $('.active-tab-counter').text(activeTabsCount);

    if (currentPage == "tabs") {
      Tabs = ReactDOM.render(<ActiveTabs />,document.getElementById('active-tabs-list-container'));
      let infoModal = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
    }


    //Seach/Filter
    $('#quicksearch-input').on('keyup',(e)=>{
        let filteredTabs = tabsList.filter((tab)=>
        {
            if(pref.filterType === "regex"){
                let regex = new RegExp(e.target.value,pref.filterCase?"i":"");
                if(regex.test(tab.title)) return true;
                if(regex.test(tab.url)) return true;
            }
            else{
                return tab.title.indexOf(e.target.value) >= 0;
            }
        });
            Tabs.setState({data:filteredTabs});
    });
    if(window.location.pathname.indexOf('tabs') > -1) chrome.runtime.onConnect.addListener(function(port){

          console.assert(port.name == "ActiveTabsConnection");
          if (port.name == "ActiveTabsConnection") {
              port.onMessage.addListener(function(msg) {
                  console.log("msg",msg);
                  activeTabsCount = msg.tabs.length;
                  $('.active-tab-counter').text(activeTabsCount);
                  if(!jQuery.isEmptyObject(msg))
                   {
                       tabsList = msg.tabs;
                       $('.active-tab-count').html(msg.tabs.length);

                         Tabs.setState({data: msg.tabs});
                         selectTab(1);

                   }
              });
          }
  });


});
