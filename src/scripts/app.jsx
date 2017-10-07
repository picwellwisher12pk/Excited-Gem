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