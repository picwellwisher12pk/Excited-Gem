'use strict';
//Scripts and Modules
import CustomScroll from 'react-custom-scroll';
import {useCallback} from 'react';
import {connect} from 'react-redux';
import 'react-devtools';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend'

//JS libraries
import '../images/logo.png';
import '../images/dev-logo.png';
// React Components
import ACTIONS from './action';

import Header from './components/Header/Header';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import Tab from './components/Accordion/TabsGroup/Tab/index';
//Styles
import '../styles/eg.scss';

require('react-custom-scroll/dist/customScroll.css');

let browser = require('webextension-polyfill');

// import ErrorBoundary from './ErrorBoundary';

const ActiveTabs = (props) => {

  const filterTabs = () => {
    if (props.preferences.searchTerm === '') return props.tabs;
    return props.tabs.filter(tab => {
      if (props.preferences.search.regex) {
        try {
          let regex = new RegExp(props.preferences.searchTerm, props.preferences.search.ignoreCase ? 'i' : '');
          if (props.preferences.search.searchIn[0]) {
            if (regex.test(tab.title)) return true;
          }
          if (props.preferences.search.searchIn[1]) {
            if (regex.test(tab.url)) return true;
          }
        } catch (error) {
          console.log("search error:", error);
        }

      } else {
        if (props.preferences.search.searchIn[0]) {
          return tab.title.includes(props.preferences.searchTerm);
        }
        if (props.preferences.search.searchIn[1]) {
          return tab.url.includes(props.preferences.searchTerm);
        }
      }
    });
  }

  const moveTab = useCallback((itemId, dragIndex, index) => {
    browser.tabs.move(itemId, {index});
  }, [props.tabs]);

  const tabTemplate = (tab) => {
    let checked = false;
    //If no tab is selected, add current tab to selectedTabs
    if (props.selectedTabs.length === 0) checked = props.selectedTabs.includes(tab.id);
    return (
      <Tab
        key={tab.id}
        index={tab.index}
        {...tab}
        activeTab={true}
        checked={checked}
        // closeTab={closeTab}
        // togglePin={togglePin}
        // toggleMute={toggleMute}
        moveTab={moveTab}
        // updateSelectedTabs={updateSelectedTabs}
      />
    );
  }




    return [
      <Header
        key={'header'}
        tabs={props.tabs}
        preferences={props.preferences}
        // searchInTabs={searchInTabs}
        // processSelectedTabs={processSelectedTabs}
      />,
      <CustomScroll heightRelativeToParent="100%">
        <div className="tabs-list-container" key={'activetablist'}>
          <DndProvider backend={HTML5Backend}>
            <Tabsgroup preferences={props.preferences} id={'tabsgroup'}>
              {filterTabs().map(tab => tabTemplate(tab), this)}
            </Tabsgroup>
          </DndProvider>
        </div>
        ,
      </CustomScroll>,
    ];

}

const mapStateToProps = function(state) {
  return {
    tabs: state.tabs,
    preferences: state.preferences,
    selectedTabs: state.preferences.selectedTabs,
  };
};
const mapDispatchToProps = dispatch => ({
  reorderTabs: tabs => dispatch(ACTIONS.reorderTabs(tabs)),
  deleteItem: id => dispatch(ACTIONS.deleteItem(id)),
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  updateActiveTabs: () => dispatch(ACTIONS.updateActiveTabs()),
  updateSelectedTabsAction: selectedTabs => dispatch(ACTIONS.updateSelectedTabsAction(selectedTabs)),
});
export default connect(mapStateToProps, mapDispatchToProps)(ActiveTabs);
