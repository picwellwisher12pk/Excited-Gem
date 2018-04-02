//Scripts and Modules
//Vendors
const $ = (jQuery = require('jquery'));
const bootstrap = require('bootstrap');

// import offCanvasNav from "./vendor/codedrops/sidebarEffects";
import React from 'react';
// import {render} from "react-dom";
import ReactDOM from 'react-dom';

//JS components
import packagedAndBroadcast from './components/communications.js';
import * as general from './components/general.js';
import selectTab from './components/tabSelection.js';
// require("./components/general.js");

// React Components
import Navigation from './react-components/navigation.rc.js';
import ActiveTabs from './react-components/active-tabs.js';
import InfoModal from './react-components/info-modal.js';
// import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import '../styles/bootstrap.scss';
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';
// import "../styles/codedrops/component.scss";

//Images
import '../images/logo.svg';
import '../images/extension-icon16.png';
import '../images/extension-icon48.png';
import '../images/extension-icon128.png';
import '../images/icon38.png';
import '../images/icon19.png';
import '../images/arrange.svg';
import '../images/close-icon.svg';
import '../images/info-icon.svg';
import '../images/pin-icon.svg';
import '../images/reload-icon.svg';
import '../images/search-icon.svg';
import '../images/sound-icon.svg';
import '../images/gem.svg';

//Declarations
let windowHeight;
const sender = 'content';
let tabsList;
let Tabs;
let NavigationReference;
let infoModal;
// let activeTabsCount;
let currentPage = '';
let pref = {
  filterType: 'regex',
  filterCase: 'true',
};
let client = browser;
client.tabs.onUpdated.addListener(function(tabId, info) {
  console.log('onExtension page on updated event', tabId, info);
});

$(document).ready(() => {
  // getReadingLists();
  // general.highlightCurrentNavLink(); //Highlight (Add Active class to current navigation link) Current page Link in header navigation

  packagedAndBroadcast(sender, 'background', 'documentready', null); //Tells background environment when front-page's DOM is ready to start communication
  let tabs;
  client.tabs.query({}, tabs => {
    // if(tabs) tabs = Tabs.setState({ tabs: tabs });
  });
  Tabs = ReactDOM.render(<ActiveTabs tabs={tabs} />, document.getElementById('active-tabs-list-container'));

  NavigationReference = ReactDOM.render(<Navigation />, document.getElementById('navigation'));
  infoModal = ReactDOM.render(<InfoModal />, document.getElementById('infoModal'));
  //Seach/Filter
  $('#quicksearch-input').on('keyup', e => {
    let filteredTabs = general.searchInTabs(e.target.value, tabsList);
    Tabs.setState({ tabs: filteredTabs });
  });
  // Sorting of Tabs (Title | URL). Event Binding
  $('#rearrange-title-btn').on('click', () => general.sortTabs(0, 'title', tabsList));
  $('#rearrange-url-btn').on('click', () => general.sortTabs(0, 'url', tabsList));

  //Making a communcation channel with background environment to send and recieve data.
  browser.runtime.onConnect.addListener(port => {
    if (port.name === 'ActiveTabsConnection') {
      port.onMessage.addListener(msg => {
        tabsList = msg.tabs;
        activeTabsCount = msg.tabs.length;
        $('.active-tab-counter').text(msg.tabs.length); //Rendering count of current number of active tabs in navigation next to Tabs's label.
        console.log('messages', msg.tabs);
        Tabs.setState({ data: msg.tabs });
        selectTab(1);
      });
    }
  });
});
