//Scripts and Modules
//Vendors
// const $ = (jQuery = require('jquery'));
const bootstrap = require('bootstrap');
// import offCanvasNav from "./vendor/codedrops/sidebarEffects";
import React from 'react';
import PropTypes from 'prop-types';
import 'react-devtools';

//JS libraries
import {updateTabs,getTabs,setTabCountInBadge} from './components/browserActions';
import * as general from './components/general.js';
// import {getTabs} from './components/browserActions';
// import selectTab from './components/tabSelection.js';

// React Components
import Search from './components/Header/Search/index';
import Tabsgroup from './components/Accordion/TabsGroup/index'
// import InfoModal from './react-components/info-modal.js';
// import { getReadingLists, setReadingLists } from "./components/readingList.jsx";

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';
// import "../styles/codedrops/component.scss";

//Images
import '../images/logo.svg';
import '../images/dev-logo.svg';
import '../images/arrange.svg';
import '../images/close-icon.svg';
import '../images/info-icon.svg';
import '../images/pin-icon.svg';
import '../images/reload-icon.svg';
import '../images/search-icon.svg';
import '../images/sound-icon.svg';

let env = require('../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;


export default class ActiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }
  componentDidMount() {

  }
  render() {
      return [
        <header className="page-header" key={1}>
          <nav className="navbar">
            <div className="navbar-brand ">
              <a href="#" className="pull-left logo" style={{marginTop: "10px"}}>
                <img src={"../images/"+env.NODE_ENV == 'production'? "logo.svg": "dev-logo.svg"} alt="" style={{height:"40px",width:"auto"}} />
              </a>
              <div id="go-to-tabs">
                Tabs
                <span className="active-tab-counter badge badge-success"></span>
                <span className="sr-only">(current)</span>
              </div>
            </div>

            <Search />
          </nav>
          <section className="context-actions container-fluid">
            <ul className="nav nav-pills pull-left">
              <li className="nav-item" >
                <div className="nav-link custom-checkbox-container">
                  <div className="custom-control custom-checkbox ">
                    <input type="checkbox" className="custom-control-input" id="checkall" />
                      <label className="custom-control-label input-group-text" htmlFor="checkall">Check All</label>
                  </div>
                </div>
              </li>
              <li role="presentation" className="nav-item">
                <a className="nav-link refreshActiveTabs" title="Refresh Active Tabs">
                  <i className="fas fa-sync-alt fa-fw fa-sm"></i> Refresh
                </a>
              </li>

              <li role="presentation" className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Rearrange/Sort Tabs" className="dropdown-toggle">
                  <i className="fas fa-sort fa-fw"></i> Rearrange by
                </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" id="rearrange-url-btn" href="#" title="Rearrange with respect of URL">URL</a>
                  <a className="dropdown-item" id="rearrange-title-btn" href="#" title="Rearrange with respect of Title">Title</a>
                </div>
              </li>
              <li role="presentation" className="nav-item dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Show Tabs from Current/All Window(s)" className="nav-link dropdown-toggle">
                  Show Tabs From
                </a>
                <div className="dropdown-menu">

                  <a className="dropdown-item" id="allWindows" href="#" title="All Windows">
                    <span className="  windowID">000</span>
                    : All Windows
                    <span className="count badge badge-success">110</span>
                  </a>
                  <a className="dropdown-item" id="currentWindow" href="#" title="Window Id:23 Tabs:10">
                    <span className="windowID">023</span>
                    : Current Window
                    <span className="count badge badge-success">50</span>
                  </a>

                </div>
              </li>
            </ul>
          </section>
          <section className="context-actions container-fluid selection-action" id="selection-action">
            <ul className="nav nav-pills pull-left">
              <li role="presentation" className="nav-item dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Selection of Tabs" className="dropdown-toggle">
                  Selection <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a id="selectAllBtn" href="#" title="Pin all selected tabs">Select All</a></li>
                  <li><a id="unselectAllBtn" href="#" title="Unpin all selected tabs">Select None </a></li>
                  <li><a id="toggleSelectionBtn" href="#" title="Toggle Pin selected tab">Toggle/Invert Selection </a></li>
                </ul>
              </li>
              <li role="presentation" className="dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Unpin/Pin Selected Tabs" className="dropdown-toggle">
                  Unpin/Pin Selected <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a id="pinSelectedBtn" href="#" title="Pin all selected tabs">Pin selected</a></li>
                  <li><a id="unpinSelectedBtn" href="#" title="Unpin all selected tabs">Unpin selected </a></li>
                  <li><a id="togglePinSelected" href="#" title="Toggle Pin selected tab">Toggle pin selected </a></li>
                </ul>
              </li>
              <li role="presentation" className="dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Unmute/Mute Selected Tabs" className="dropdown-toggle">
                  Unmute/Mute Selected <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li><a id="muteSelectedBtn" href="#" title="Pin all selected tabs">Mute selected</a></li>
                  <li><a id="unmuteSelectedBtn" href="#" title="Unpin all selected tabs">Unmute selected </a></li>
                  <li><a id="toggleMuteSelected" href="#" title="Toggle Pin selected tab">Toggle mute selected </a></li>
                </ul>
              </li>
              <li>                <a href="#" id="closeSelectedBtn">Close Selected</a>              </li>
            </ul>
            <ul className="nav nav-pills pull-right">
              <li>                <a href="#" id="closeAllBtn">Close All</a>              </li>
              <li>                <a href="#" id="muteAllBtn">Mute All</a>              </li>
            </ul>
          </section>
        </header>,
        <div className={'tabs-list-container'}>
          <Tabsgroup key={2}/>
        </div>
      ];
  }
}

