'use strict';
//Scripts and Modules
import { Scrollbars } from 'react-custom-scrollbars';
import { PureComponent } from 'react';
import { connect } from 'react-redux';
import 'react-devtools';
// import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { DragDropContext } from 'react-beautiful-dnd';
//JS libraries
import { getTabs } from './components/browserActions';
import { addClass, removeClass } from './components/general.js';
import { saveTabs } from './components/getsetSessions';
import '../images/logo.png';
import '../images/dev-logo.png';
// React Components
import ACTIONS from './modules/action';

import Header from './components/Header/Header';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import Tab from './components/Accordion/TabsGroup/Tab/index';
//Styles
import '../styles/eg.scss';

let browser = require('webextension-polyfill');

// import ErrorBoundary from './ErrorBoundary';

function reorder(list, startIndex, endIndex) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

class ActiveTabs extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = { ...this.props };
    // this.state = {
    //   selectedTabs: [],
    //   allMuted: false,
    //   allSelected: false,
    //   allPinned: false,
    // };

    this.closeTab = this.closeTab.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.isAllMuted = this.isAllMuted.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.updateSelectedTabs = this.updateSelectedTabs.bind(this);
    this.setPreferences = this.setPreferences.bind(this);
    this.processSelectedTabs = this.processSelectedTabs.bind(this);
    this.togglePin = this.togglePin.bind(this);
    const menu = document.querySelector('#context-menu');
    let menuVisible = false;

    const toggleMenu = command => {
      menu.style.display = command === 'show' ? 'block' : 'none';
      menuVisible = !menuVisible;
    };

    const setPosition = ({ top, left }) => {
      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      toggleMenu('show');
    };

    window.addEventListener('click', () => {
      if (menuVisible) toggleMenu('hide');
    });

    window.addEventListener('contextmenu', e => {
      e.preventDefault();
      const origin = {
        left: e.pageX,
        top: e.pageY,
      };
      setPosition(origin);
      return false;
    });
  }

  componentDidMount(a, b) {
    this.setState({ allMuted: this.isAllMuted() });
    this.setState({ allPinned: this.isAllPinned() });
    this.setState({ allSelected: this.isAllSelected() });
    this.setState({ preferences: this.props.preferences });
    // debugger;
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   console.log('activeTabs SHOULDCOMPONENTUPDATE', nextProps, nextState);
  //   nextProps.tabs.forEach(tab => {});
  //   //if nextstate is not set forget and return True
  //   if (nextState.tabs != undefined) {
  //     //Check if previous state and next state is different in leghth
  //     //then return true to rerender the component
  //     if (nextProps.tabs.length != nextState.tabs.length) return true;
  //     //If lenght is same check all tabs one bye one to look for differences.
  //     //If even one of tab is different in terms of any property, name or loading state etc , then return true to rerender
  //     for (let i = 0; i < nextProps.tabs.length; i++) {
  //       if (!objectsAreSame(nextProps.tabs[i], nextState.tabs[i])) return true;
  //     }
  //   }
  //   return false;
  // }

  //Creating SelectedTabs status
  updateSelectedTabs(id, selected) {
    let tempArray = this.props.selectedTabs;
    !selected ? tempArray.splice(tempArray.indexOf(id), 1) : tempArray.push(id);
    tempArray.length > 0
      ? addClass(document.querySelector('#selection-action'), 'selection-active')
      : removeClass(document.querySelector('#selection-action'), 'selection-active');
    this.props.updateSelectedTabsAction(tempArray);
  }
  isAllSelected() {
    for (let tab of this.props.tabs) {
      if (!tab.checked) return false;
    }
    return true;
  }
  //Close
  closeTab(key, promptForClosure = this.props.preferences.promptForClosure) {
    if (promptForClosure) {
      if (!confirm(`Are you sure you want to close the following tab\n` + key)) return false;
    }
    browser.tabs.remove(parseInt(key));
  }
  //Pinned
  pinTab(tabId) {
    console.info('pinning');
    browser.tabs.update(tabId, { pinned: true });
    getTabs().then(
      tabs => {
        this.setState({ tabs: tabs });
      },
      error => log(`Error: ${error}`)
    );
  }
  unpinTab(tabId) {
    console.info('unpinning');
    browser.tabs.update(tabId, { pinned: false });
    getTabs().then(
      tabs => {
        this.setState({ tabs: tabs });
      },
      error => log(`Error: ${error}`)
    );
  }
  togglePin(tabId) {
    let tabTemp = this.props.tabs.filter(tab => tab.id === tabId);
    tabTemp[0].pinned ? this.unpinTab(tabId) : this.pinTab(tabId);
  }
  isAllPinned() {
    for (let tab of this.props.tabs) {
      if (!tab.pinned) return false;
    }
    return true;
  }
  //Muted or Not
  muteTab(id) {
    browser.tabs.update(parseInt(id), { muted: true });
  }
  unmuteTab(id) {
    browser.tabs.update(parseInt(id), { muted: false });
  }
  toggleMute(id) {
    browser.tabs.get(id).then(tab => {
      browser.tabs.update(parseInt(id), { muted: !tab.mutedInfo.muted });
    });
    this.props.updateActiveTabs();
  }
  isAllMuted() {
    // const tabs = this.props.tabs.then(tabs => tabs);
    for (let tab of this.props.tabs) {
      if (!tab.mutedInfo.muted) return false;
    }
    return true;
  }
  processSelectedTabs(action, selection = this.props.selectedTabs) {
    switch (action) {
      case 'closeSelected':
        let message = 'Are you sure you want to close selected tabs';
        if (selection.length === this.props.tabs.length)
          message = 'Are you sure you want to close all the tabs? This will also close this window.';
        if (!confirm(message)) return false;
        for (let id of selection) this.closeTab(id, false);
        this.setState({ selectedTabs: [] });
        removeClass(document.querySelectorAll('#selection-action'), 'selection-active');
        break;
      case 'toNewWindow':
        let targetWindow = browser.windows.create();
        targetWindow.then(windowInfo => {
          browser.tabs.move(selection, { windowId: windowInfo.id, index: 0 });
        });
        break;
      case 'toSession':
        saveTabs(selection.map(selectedTab => this.state.tabs.find(o => selectedTab === o.id)));
        break;
      case 'pinSelected':
        for (let tab of selection) this.pinTab(tab);
        break;
      case 'unpinSelected':
        for (let tab of selection) this.unpinTab(tab);
        break;
      case 'togglePinSelected':
        for (let tab of selection) !tab.pinned ? this.pinTab(tab) : this.unpinTab(tab);
        break;

      //Mute
      case 'muteSelected':
        console.log('muting');
        for (let tab of selection) this.muteTab(tab);
        break;
      case 'unmuteSelected':
        for (let tab of selection) this.unmuteTab(tab);
        break;
      case 'toggleMuteSelected':
        for (let tab of selection) !tab.mutedInfo.muted ? this.muteTab(tab) : this.unmuteTab(tab);
        break;

      //Selection
      case 'selectAll':
        this.setState({ selectedTabs: this.filterTabs().map(tab => tab.id) });
        addClass(document.querySelectorAll('#selection-action'), 'selection-active');
        break;
      case 'selectNone':
        this.setState({ selectedTabs: [] });
        removeClass(document.querySelectorAll('#selection-action'), 'selection-active');
        break;
      case 'invertSelection':
        let inverted = this.props.tabs.filter(tab => !this.props.selectedTabs.includes(tab.id)).map(tab => tab.id);
        this.setState({ selectedTabs: inverted });
        break;
    }
  }

  filterTabs() {
    if (this.props.preferences.searchTerm === '') return this.props.tabs;
    return this.props.tabs.filter(tab => {
      if (this.props.preferences.search.regex) {
        let regex = new RegExp(this.props.preferences.searchTerm, this.props.preferences.search.ignoreCase ? 'i' : '');
        if (this.props.preferences.search.searchIn[0]) {
          if (regex.test(tab.title)) return true;
        }
        if (this.props.preferences.search.searchIn[1]) {
          if (regex.test(tab.url)) return true;
        }
      } else {
        if (this.props.preferences.search.searchIn[0]) {
          return tab.title.includes(this.props.preferences.searchTerm);
        }
        if (this.props.preferences.search.searchIn[1]) {
          return tab.url.includes(this.props.preferences.searchTerm);
        }
      }
    });
  }
  setPreferences(prefSection, key, value) {
    browser.storage.local.get('preferences').then(result => {
      let jsonObj = result;
      jsonObj['preferences'][prefSection][key] = value;
      browser.storage.local.set(jsonObj).then(() => {
        browser.notifications.create(
          'reminder',
          {
            type: 'basic',
            iconUrl: '../images/logo.svg',
            title: 'Settings Saved',
            message: 'Search settings updated',
          },
          function(notificationId) {}
        );
      });
    });
  }

  tabTemplate(tab) {
    let checked = false;
    if (this.props.selectedTabs !== []) checked = this.props.selectedTabs.includes(tab.id);
    return (
      <Tab
        key={tab.index}
        {...tab}
        activeTab={true}
        checked={checked}
        closeTab={this.closeTab}
        togglePin={this.togglePin}
        toggleMute={this.toggleMute}
        updateSelectedTabs={this.updateSelectedTabs}
      />
    );
  }

  onDragEnd(result) {
    const { destination, source } = result;
    if (!result.destination) return;

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const tabs = reorder(this.filterTabs(), source.index, destination.index);
    this.props.reorderTabs(tabs);
    browser.tabs.move(result.draggableId, { index: result.destination.index });
  }
  render() {
    return [
      <Header
        key={'header'}
        tabs={this.props.tabs}
        preferences={this.props.preferences}
        searchInTabs={this.searchInTabs}
        processSelectedTabs={this.processSelectedTabs}
      />,
      <Scrollbars autoHeight={false} autoHeightMax={'auto'} key={'scrollbar'}>
        <div className="tabs-list-container" key={'activetablist'}>
          <DragDropContext onDragEnd={this.onDragEnd} key={'ddcontext'} id={'activeTabs'}>
            <Tabsgroup preferences={this.props.preferences} id={'tabsgroup'}>
              {this.filterTabs().map(tab => this.tabTemplate(tab), this)}
            </Tabsgroup>
          </DragDropContext>
        </div>,
      </Scrollbars>,
    ];
  }
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
