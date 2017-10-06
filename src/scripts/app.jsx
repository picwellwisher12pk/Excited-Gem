//Scripts and Modules
import $ from 'jquery';
require('bootstrap');
import packagedAndBroadcast from "./components/communications.jsx";
import ActiveTabs from "./react-components/activetabs.jsx";
import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import "../styles/bootstrap.scss";
import "../styles/eg.scss";
// require("../styles/eg.scss");

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