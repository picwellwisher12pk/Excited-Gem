//Scripts and Modules
require( 'jquery');
require('bootstrap');
import packagedAndBroadcast from "./components/communications.jsx";
import ActiveTabs from "./react-components/activetabs.jsx";
import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import "../styles/bootstrap.scss";
import "../styles/eg.scss";
// require("../styles/eg.scss");

import "../images/extension-icon16.png";
import "../images/extension-icon48.png";
import "../images/extension-icon128.png";
import "../images/icon38.png";
import "../images/icon19.png";
//Declarations
let windowHeight;
const sender = "content";
let tabsList;
let activeTabsCount;
let selectedTabIndex;
let currentPage = "";
let currentURL;




$(document).ready(function() {
    getReadingLists();
    currentURL = window.location.pathname;
    getCurrentURL();
    packagedAndBroadcast(sender, 'background', 'documentready', null); //Tells background page when front-page's DOM is ready to start communication
    $('.active-tab-counter').text(activeTabsCount);
});