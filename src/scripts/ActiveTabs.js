//Scripts and Modules
const bootstrap = require('bootstrap');
// const debug = require('debug')('activetabs');
import React from 'react';
import PropTypes from 'prop-types';
import 'react-devtools';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
let browser = require('webextension-polyfill');
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

//JS libraries
import { updateTabs, getTabs } from './components/browserActions';
import { sortTabs } from './components/general.js';

// React Components
import Search from './components/Header/Search/index';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import Tab from './components/Accordion/TabsGroup/Tab/index';
import WindowSelector from './components/WindowSelector';

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5/fa-regular.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

//Images
let logo;
NODE_ENV === 'production' ? (logo = require('../images/logo.png')) : (logo = require('../images/dev-logo.png'));
import '../images/arrange.svg';
import '../images/close-icon.svg';
import '../images/info-icon.svg';
import '../images/pin-icon.svg';
import '../images/reload-icon.svg';
import '../images/search-icon.svg';
import '../images/sound-icon.svg';

export default class ActiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      preferences: {},
      selectedTabs: [],
      allMuted: false,
      allSelected: false,
      allPinned: false,
    };
    this.setPreferences = this.setPreferences.bind(this);
    this.closeTab = this.closeTab.bind(this);
    this.searchInTabs = this.searchInTabs.bind(this);
    this.updateSelectedTabs = this.updateSelectedTabs.bind(this);
    this.togglePin = this.togglePin.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log(nextProps, prevState);
    return nextProps;
  }
  componentDidMount(a, b) {
    this.setState({ allMuted: this.isAllMuted() });
    this.setState({ allPinned: this.isAllPinned() });
    this.setState({ allPinned: this.isAllSelected() });
    this.setState({ tabs: window.tabs });
    this.setState({ preferences: this.props.preferences });
    console.log('mounted', window.tabs, this.state.tabs);
  }
  componentDidUpdate(a, b) {}

  updateSelectedTabs(id, selected) {
    let tempArray = this.state.selectedTabs;
    !selected ? tempArray.splice(tempArray.indexOf(id), 1) : tempArray.push(id);
    tempArray.length > 0
      ? $('#selection-action').addClass('selection-active')
      : $('#selection-action').removeClass('selection-active');
    this.setState({ selectedTabs: tempArray });
    this.setState({ tabs: window.tabs });
  }
  isAllSelected() {
    for (let tab of window.tabs) {
      if (!tab.checked) return false;
    }
    return true;
  }
  //Close
  closeTab(key, promptForClosure = this.state.preferences.promptForClosure) {
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
    let tab = this.state.tabs.filter(tab => tab.id == tabId);
    tab[0].pinned ? this.unpinTab(tabId) : this.pinTab(tabId);
  }
  isAllPinned() {
    for (let tab of window.tabs) {
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
    getTabs().then(
      tabs => {
        this.setState({ tabs: tabs });
      },
      error => log(`Error: ${error}`)
    );
  }
  isAllMuted() {
    for (let tab of window.tabs) {
      if (!tab.mutedInfo.muted) return false;
    }
    return true;
  }
  processSelectedTabs(action, selection = this.state.selectedTabs) {
    // let selection = this.state.tabs.filter(tab => selection.includes(tab.id));
    console.log(selection, selection, this.state.selectedTabs, this.state.tabs.map(tab => tab.id));
    switch (action) {
      case 'closeSelected':
        let message = 'Are you sure you want to close selected tabs';
        if (selection.length == this.state.tabs.length)
          message = 'Are you sure you want to close all the tabs? This will also close this window.';
        if (!confirm(message)) return false;
        for (let id of selection) this.closeTab(id, false);
        this.setState({ selectedTabs: [] });
        $('#selection-action').removeClass('selection-active');
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
        $('#selection-action').addClass('selection-active');
        break;
      case 'selectNone':
        this.setState({ selectedTabs: [] });
        $('#selection-action').removeClass('selection-active');
        break;
      case 'invertSelection':
        let inverted = this.state.tabs.filter(tab => !this.state.selectedTabs.includes(tab.id)).map(tab => tab.id);
        this.setState({ selectedTabs: inverted });
        break;
    }
  }
  sortBy(parameter) {
    sortTabs(parameter);
  }
  filterTabs() {
    if (window.searchTerm == '') return window.tabs;
    let filteredTabs = window.tabs.filter(tab => {
      if (this.state.preferences.search.regex) {
        let regex = new RegExp(window.searchTerm, this.state.preferences.search.ignoreCase ? 'i' : '');
        if (this.state.preferences.search.searchIn[0]) {
          if (regex.test(tab.title)) return true;
        }
        if (this.state.preferences.search.searchIn[1]) {
          if (regex.test(tab.url)) return true;
        }
      } else {
        if (this.state.preferences.search.searchIn[0]) {
          return tab.title.indexOf(window.searchTerm) >= 0;
        }
        if (this.state.preferences.search.searchIn[1]) {
          return tab.url.indexOf(window.searchTerm) >= 0;
        }
      }
    });
    return filteredTabs;
  }
  searchInTabs(searchTerm) {
    window.searchTerm = searchTerm;
    this.forceUpdate();
  }
  setPreferences(prefSection, key, value) {
    browser.storage.local.get('preferences').then(result => {
      let jsonObj = result;
      jsonObj['preferences'][prefSection][key] = value;
      browser.storage.local.set(jsonObj).then(tempResult => {
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
    if (this.state.selectedTabs) checked = this.state.selectedTabs.includes(tab.id);
    return (
      <Tab
        id={tab.id}
        indexkey={tab.index}
        key={tab.id}
        pinned={tab.pinned}
        audible={tab.audible}
        muted={tab.mutedInfo.muted}
        position={tab.index}
        url={tab.url}
        title={tab.title}
        discarded={tab.discarded}
        favIconUrl={tab.favIconUrl}
        status={tab.status}
        checked={checked}
        closeTab={this.closeTab}
        togglePin={this.togglePin}
        toggleMute={this.toggleMute}
        updateSelectedTabs={this.updateSelectedTabs}
      />
    );
  }
  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  }
  onDragEnd(result) {
    if (!result.destination) return;
    browser.tabs.move(result.draggableId, { index: result.destination.index });
    window.activeTabs.setState({tabs:window.tabs});
  }
  render() {
    console.log(this.state.tabs.length, this.props.tabs.length);
    return [
      <header className="page-header" key={1}>
        <nav className="navbar">
          <div className="navbar-brand ">
            <a href="#" className="pull-left logo" style={{ marginTop: '10px' }}>
              <img src={logo} alt="" style={{ height: '40px', width: 'auto' }} />
            </a>
            <div id="go-to-tabs">
              Tabs
              <span
                className={`active-tab-counter badge ` + (window.tabs.length > 50 ? 'badge-danger' : 'badge-success')}
              >

                {window.tabs.length ? window.tabs.length : ''}
              </span>
              <span className="sr-only"> (current) </span>
            </div>
          </div>
          <Search
            regex={this.state.preferences.search.regex}
            ignoreCase={this.state.preferences.search.ignoreCase}
            searchIn={this.state.preferences.search.searchIn}
            searchInTabs={this.searchInTabs}
            setPreferences={this.setPreferences}
          />
        </nav>
        <section className="context-actions navbar container-fluid" id="selection-action">
          <ul className="nav nav-pills pull-left">
            <li className="nav-item">
              <a
                className="nav-link"
                onClick={() => {
                  !this.state.allSelected
                    ? this.processSelectedTabs('selectAll', this.state.tabs.map(tab => tab.id))
                    : this.processSelectedTabs('selectNone', this.state.tabs.map(tab => tab.id));

                  this.setState({ allSelected: !this.state.allSelected });
                }}
                title="Select All"
              >
                <input type="checkbox" checked={this.state.allSelected} readOnly />
              </a>
            </li>
            <li className="nav-item dropdown">
              <div className="input-group" style={{ width: 'auto', marginRight: '15px' }}>
                <a
                  className="form-control"
                  onClick={() => this.processSelectedTabs('togglePinSelected')}
                  href="#"
                  title="Toggle Pin selected tab"
                  style={{ border: 'none' }}
                >
                  Sort by
                </a>
                <div className="input-group-append" id="button-addon4">
                  <button
                    className="btn btn-default"
                    type="button"
                    title="Pin Selected"
                    onClick={this.sortBy.bind(null, 'title')}
                  >
                    Title
                  </button>
                  <button
                    className="btn btn-default"
                    type="button"
                    title="Unpin Selected"
                    onClick={this.sortBy.bind(null, 'url')}
                  >
                    URL
                  </button>
                </div>
              </div>
            </li>
            <WindowSelector />
          </ul>
          <div className="nav context-actions selection-action">
            <div className="input-group" style={{ width: 'auto', marginRight: '15px' }}>
              <a
                className="form-control"
                onClick={() => this.processSelectedTabs('togglePinSelected')}
                href="#"
                title="Toggle Pin selected tab"
                style={{ border: 'none' }}
              >
                Un / Pin Selected
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-default"
                  type="button"
                  title="Pin Selected"
                  onClick={() => this.processSelectedTabs('pinSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fa fa-thumbtack fa-fw" />
                </button>
                <button
                  className="btn btn-default"
                  type="button"
                  title="Unpin Selected"
                  onClick={() => this.processSelectedTabs('unpinSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="far fa-thumbtack" />
                </button>
              </div>
            </div>
            <div className="input-group" style={{ width: 'auto', marginRight: '15px' }}>
              <a
                className="form-control"
                onClick={() => this.processSelectedTabs('toggleMuteSelected')}
                href="#"
                title="Toggle Pin selected tab"
                style={{ border: 'none' }}
              >
                Un / Mute Selected
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-default"
                  type="button"
                  title="Mute Selected"
                  onClick={() => this.processSelectedTabs('muteSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fa fa-volume-mute" />
                </button>
                <button
                  className="btn btn-default"
                  type="button"
                  title="Unmute Selected"
                  onClick={() => this.processSelectedTabs('unmuteSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fa fa-volume-up" />
                </button>
              </div>
            </div>
            <button
              className="btn btn-default"
              type="button"
              title="Close Selected"
              onClick={() => this.processSelectedTabs('closeSelected')}
              style={{ backgroundColor: 'white' }}
            >
              <i className="fa fa-times-circle" />
            </button>
          </div>
          <ul className="nav nav-pills">
            <li role="presentation" className="nav-item">
              <a
                className="nav-link refreshActiveTabs"
                title="Refresh Excited Gem Tabs"
                href="#"
                onClick={() => {
                  updateTabs();
                  this.setState({ tabs: window.tabs });
                }}
              >
                <i className="fas fa-sync-alt fa-fw fa-sm" />
              </a>
            </li>
            <li style={{ marginRight: 18 }} className="nav-item">
              <a
                href="#"
                onClick={() => {
                  !this.state.allPinned
                    ? this.processSelectedTabs('pinSelected', this.filterTabs().map(tab => tab.id))
                    : this.processSelectedTabs('unpinSelected', this.filterTabs().map(tab => tab.id));
                  this.setState({ allPinned: !this.state.allPinned });
                }}
                title={!this.state.allPinned ? `Pin All` : `Unpin All`}
                className="nav-link"
              >
                <i className={!this.state.allPinned ? `far fa-thumbtack` : `fa fa-thumbtack`} />
              </a>
            </li>
            <li style={{ marginRight: 18 }} className="nav-item">
              <a
                href="#"
                className="nav-link"
                onClick={event => {
                  !this.state.allMuted
                    ? this.processSelectedTabs('muteSelected', this.filterTabs().map(tab => tab.id))
                    : this.processSelectedTabs('unmuteSelected', this.filterTabs().map(tab => tab.id));
                  this.setState({ allMuted: !this.state.allMuted });
                }}
                title={!this.state.allMuted ? `Mute All` : `Unmute All`}
              >

                <i className={`fa fa-fw ` + (!this.state.allMuted ? `fa-volume-up` : `fa-volume-mute`)} />
              </a>
            </li>
            <li style={{ marginRight: 0 }} className="nav-item">
              <a
                href="#"
                title="Close All"
                className="nav-link"
                onClick={() => this.processSelectedTabs('closeSelected', this.filterTabs().map(tab => tab.id))}
              >
                <i className="fa fa-times-circle fw-fw" />
              </a>
            </li>
          </ul>
        </section>
      </header>,
      <div className="tabs-list-container">
        <DragDropContext onDragEnd={ this.onDragEnd } key={2} >
            <Tabsgroup preferences={this.props.preferences} tabs={this.state.tabs}>
            {this.filterTabs().map(
              tab => (
                <CSSTransition
                  transitionName="fade"
                  classNames="fade"
                  appear={this.state.preferences.tabsGroup.tabsListAnimation}
                  exit={false}
                  key={tab.id}
                  timeout={{ enter: 200, exit: 0 }}
                >

                  {this.tabTemplate(tab)}
                </CSSTransition>
              )
            )}
          </Tabsgroup>
        </DragDropContext>
      </div>,
    ];
  }
}

ActiveTabs.propTypes = {
  preferences: PropTypes.object,
  tabs: PropTypes.array,
};
ActiveTabs.defaultProps = {
  tabs: [],
};
