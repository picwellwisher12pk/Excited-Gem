//Scripts and Modules
// import { preferences } from './defaultPreferences';
const bootstrap = require('bootstrap');
// const debug = require('debug')('activetabs');
import { Scrollbars } from 'react-custom-scrollbars';
import React from 'react';
import PropTypes from 'prop-types';
import 'react-devtools';
import { CSSTransition } from 'react-transition-group';
let browser = require('webextension-polyfill');

//JS libraries
import { updateTabs, getTabs } from './components/browserActions';
import { sortTabs } from './components/general.js';
import { saveTabs } from './components/getsetSessions';

// React Components
import Search from './components/Header/Search/index';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import Tab from './components/Accordion/TabsGroup/Tab/index';
import WindowSelector from './components/WindowSelector';
// import ErrorBoundary from './ErrorBoundary';

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5/fa-regular.scss';
import '../styles/fontawesome5/fa-light.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

//Images
let logo;
NODE_ENV === 'production'
  ? (logo = require('../images/logo.svg'))
  : (logo = require('../images/dev-logo.svg'));
NODE_ENV === 'production'
  ? (logo = require('../images/logo.png'))
  : (logo = require('../images/dev-logo.png'));

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

    window.addEventListener('click', e => {
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
  static getDerivedStateFromProps(nextProps, prevState) {
    // console.log(nextProps,prevState);
    return nextProps;
  }
  componentDidMount(a, b) {
    this.setState({ allMuted: this.isAllMuted() });
    this.setState({ allPinned: this.isAllPinned() });
    this.setState({ allPinned: this.isAllSelected() });
    this.setState({ tabs: window.tabs });
    this.setState({ preferences: this.props.preferences });
    // console.log("mounted",window.tabs,this.state.tabs);
  }
  // componentDidUpdate(a, b) {}

  //Creating SelectedTabs status
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
      case 'toNewWindow':
        let targetWindow = browser.windows.create();
        targetWindow.then(windowInfo => {
          browser.tabs.move(selection, { windowId: windowInfo.id, index: 0 });
        });

      case 'toSession':
        saveTabs(selection.map(selectedTab => this.state.tabs.find(o => selectedTab == o.id)));

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
            message: 'Search settings updated'
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
        indexkey={tab.id}
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
        activeTab={true}
        closeTab={this.closeTab}
        togglePin={this.togglePin}
        toggleMute={this.toggleMute}
        updateSelectedTabs={this.updateSelectedTabs}
      />
    );
  }
  render() {
    // console.log(this.state.tabs.length,this.props.tabs.length);
    return [
      <header className="page-header" key={1}>
        <nav className="navbar navbar-expand-lg navbar-expand-md">
          <div className="navbar-brand ">
            <a href="#" className="pull-left logo" style={{ marginTop: '10px' }}>
              <img src={logo} alt="" style={{ height: '40px', width: 'auto' }} />
            </a>
          </div>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item active">
                <a className="nav-link text-white font-weight-bold" href="/tabs.html" id="go-to-tabs">
                  Tabs
                  <span
                    className={
                      `active-tab-counter badge ` + (window.tabs.length > 50 ? 'badge-danger' : 'badge-success')
                    }
                  >
                    {window.tabs.length ? window.tabs.length : ''}
                  </span>
                  <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="/sessions.html">
                  Sessions
                </a>
              </li>
            </ul>
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
              <div
                className="input-group"
                style={{
                  width: 'auto',
                  marginRight: '15px',
                  border: '1px solid #7cbbff'
                }}
              >
                <a
                  className="form-control bg-transparent text-white"
                  href="#"
                  title="Sort Tabs"
                  style={{ border: 'none' }}
                >
                  <i className="fal fa-sort" />
                </a>
                <div className="input-group-append" id="button-addon4">
                  <button
                    className="btn btn-link text-white"
                    type="button"
                    title="Pin Selected"
                    onClick={this.sortBy.bind(null, 'title')}
                  >
                    Title
                  </button>
                  <button
                    className="btn btn-link text-white"
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
                Un/Pin Selected
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-default"
                  type="button"
                  title="Unpin Selected"
                  onClick={() => this.processSelectedTabs('unpinSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fal fa-map-marker-slash" />
                </button>
                <button
                  className="btn btn-default"
                  type="button"
                  title="Pin Selected"
                  onClick={() => this.processSelectedTabs('pinSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fas fa-map-marker fa-fw" />
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
                Un/Mute Selected
              </a>
              <div className="input-group-append" id="button-addon4">
                <button
                  className="btn btn-default"
                  type="button"
                  title="Mute Selected"
                  onClick={() => this.processSelectedTabs('muteSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fal fa-volume-slash" />
                </button>
                <button
                  className="btn btn-default"
                  type="button"
                  title="Unmute Selected"
                  onClick={() => this.processSelectedTabs('unmuteSelected')}
                  style={{ backgroundColor: 'white' }}
                >
                  <i className="fas fa-volume-up" />
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
              <i className="fas fa-times text-danger" />
            </button>
            <div className="dropdown">
              <a
                className="btn btn-secondary dropdown-toggle"
                onClick={() => this.processSelectedTabs('')}
                role="button"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                With Selected
              </a>

              <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <a className="dropdown-item" href="#" onClick={() => this.processSelectedTabs('toNewWindow')}>
                  Move to New Window
                </a>
                <a className="dropdown-item" href="#" onClick={() => this.processSelectedTabs('toSession')}>
                  Make Session/Saved Tabs
                </a>
              </div>
            </div>
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
                <i className="far fa-sync-alt fa-fw fa-sm" />
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
                <i className={!this.state.allPinned ? `fal fa-map-marker` : `fal fa-map-marker-slash`} />
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
                <i className={`fal fa-fw ` + (!this.state.allMuted ? `fa-volume-up` : `fa-volume-up-slash`)} />
              </a>
            </li>
            <li style={{ marginRight: 0 }} className="nav-item">
              <a
                href="#"
                title="Close All"
                className="nav-link"
                onClick={() => this.processSelectedTabs('closeSelected', this.filterTabs().map(tab => tab.id))}
              >
                <i className="fal fa-times fw-fw" />
              </a>
            </li>
          </ul>
        </section>
      </header>,
      <Scrollbars autoHeight={false} autoHeightMax={'auto'}>
        <div className="tabs-list-container" key={2}>
          <Tabsgroup preferences={this.props.preferences} tabs={this.state.tabs}>
            {this.filterTabs().map(
              tab => (
                <CSSTransition
                  transitionName="fade"
                  classNames="fade"
                  appear={
                    this.state.preferences.tabsGroup.tabsListAnimation // console.log(tab.title);
                  }
                  exit={false}
                  key={tab.id}
                  timeout={{ enter: 200, exit: 0 }}
                >
                  {this.tabTemplate(tab)}
                </CSSTransition>
              ),
              this
            )}
          </Tabsgroup>
        </div>
      </Scrollbars>,
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
