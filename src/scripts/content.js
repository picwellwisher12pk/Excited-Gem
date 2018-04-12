import $ from 'jquery';
import packageAndBroadcast from "./components/communications";
import ActiveTabs from "./components/activetabs";

get_readinglists();

let currentPage = "";
let currentURL;

$(document).ready(function() {
            currentURL = window.location.pathname;
            getCurrentURL();
            packageAndBroadcast(sender, 'background', 'documentready', null); //Tells background page when front-page's DOM is ready to start communication
            $('.active-tab-counter').text(activeTabsCount);
            $(document).keyup('.eg .tabs-list li.list-group-item button.site-name', function(e) {
                    packageAndBroadcast(sender, "background", "focusTab", $(this).parent().attr('id'));
                })
                //Section responsible for selecting tab based on up and down arrow key press
            $(document).keydown(function(e) {
                    console.log(e.key, e.which, e.code);
                    if (e.which == 40) {
                        console.log(selectedTabIndex, $('.eg .tabs-list li').length);
                        if (selectedTabIndex >= $('.eg .tabs-list li').length) {
                            selectTab($('.eg .tabs-list li').length - 1);
                        } else if (selectedTabIndex < $('.eg .tabs-list li').length - 1) {
                            selectTab(selectedTabIndex + 1);
                        }
                    }
                    if (e.which == 36) { //Home
                        selectTab(0);
                    }
                    if (e.which == 35) { //End
                        selectTab($('.eg .tabs-list li').length - 1);
                    }
                    if (e.which == 38) {
                        selectTab(selectedTabIndex - 1);
                    }
                    if (e.which == 13) { //focus tab on Enter
                        let id = $('.eg .tabs-list li.list-group-item:nth(' + selectedTabIndex + ')').attr('data-id');
                        packageAndBroadcast(sender, "background", "focusTab", id);
                    }
                    if (e.which == 46) {
                        let id = $('.eg .tabs-list li.list-group-item:nth(' + selectedTabIndex + ')').attr('data-id');
                        if (confirm('Are you sure you want to close the following this Tab')) { packageAndBroadcast(sender, "background", "closeTab", id); }
                    }
                }

                getLastSession();

                get_readinglists();

                let tempList;

                $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
                    e.target // newly activated tab
                    e.relatedTarget // previous active tab
                    if ($(e.targetMethod).prop('href') == '#readinglists') {
                        get_readinglists();
                        console.log("tab activated", e.target);
                    }
                });
                //Search/Filter
                $('#quicksearch-input').on('keyup', (e) => {
                    tempList = tabsList.filter((tab) => {
                        if (pref.filterType === "regex") {
                            let regex = new RegExp(e.target.value, pref.filterCase ? "i" : "");
                            return regex.test(tab.title);
                        } else {
                            return tab.title.indexOf(e.target.value) >= 0;
                        }
                    });
                    ActiveTabs.setState({ data: tempList });
                }); $('#filter-type-option-id').on('change', function() {
                    if ($(this).prop('checked')) {
                        pref.filterType = "regex";
                    } else {
                        pref.filterType = "normal";
                    }

                    chrome.storage.local.set({ pref: pref }, function() {
                        console.log('saving');
                    })
                });

                $('#filterCase-option-id').on('change', function() {
                    pref.filterCase = $(this).prop('checked');

                    chrome.storage.local.set({ pref: pref }, function() {
                        console.log('saving');
                    })
                });

                //Page Detection
                if (currentPage == "tabs") {
                    ActiveTabs = ReactDOM.render( < ActiveTabs / > , document.getElementById('active-tabs-list-container'));
                    InfoModal = ReactDOM.render( < InfoModal / > , document.getElementById('infoModal'));
                    $("ul.nav.navbar-nav li.tabs").toggleClass('active');
                }
                if (currentPage == "sessions") {
                    get_sessions();
                    Sessions = ReactDOM.render( < Sessions / > , document.getElementById('all-sessions'));
                    $("ul.nav.navbar-nav li.sessions").toggleClass('active');
                }

                if (currentPage == "options") {
                    getOptions();
                    $("ul.nav.navbar-nav li.options").toggleClass('active');
                }

                //Reading List
                $('#create-new-readinglist').on('click', function() {
                    readlinglistname = prompt("Enter name for your reading list");
                    console.log(readlinglistname);
                    let readinglist = {};
                    readinglist.id = readinglistsCounter;
                    readinglist.name = readlinglistname;
                    itemGroup.push(readinglist);
                    packageAndBroadcast(sender, 'background', 'createReadingListMenu', itemGroup);
                    if (readlinglistname) {
                        set_readinglists(itemGroup);
                        $('#tablist a[href="#readinglists"]').tab('show');

                    }

                });

                $('#refreshActiveTabs').on('click', function() {
                    packageAndBroadcast(sender, 'background', 'getTabsInRequestedWindowAndPost', null);
                }); $("#rearrange-title-btn").on('click', function() {
                    var i = 0;
                    sortTabs(i, 'title');
                }); $("#rearrange-url-btn").on('click', function() {
                    var i = 0;
                    sortTabs(i, 'url');
                }); $("#saveSessions-btn").on('click', function(e) {
                    e.preventDefault();
                    packageAndBroadcast(sender, 'background', 'saveSessions', null);
                }); $("#saveSessionsAndClose-btn").on('click', function() {
                    packageAndBroadcast(sender, 'background', 'saveSessionsAndClose', null);
                }); chrome.runtime.onMessage.addListener((request: any, sender: Function) => {
                    console.log(request);
                    if (request.receiver == "content") {
                        eval(request.targetMethod)(request.data);
                    }

                    return true;
                });

                windowHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;



                // })
                createQueryResultaTable();

                document.querySelector('#go-to-options').addEventListener('click', function() {
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