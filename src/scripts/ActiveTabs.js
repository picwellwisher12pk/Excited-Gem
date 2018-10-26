//Scripts and Modules
// import {preferences} from "./defaultPreferences";
import {preferences} from "./defaultPreferences";

let env = require('../../utils/env');
let client =  env.browserClient == 'firefox' ? browser : chrome;

const bootstrap = require('bootstrap');
import React from 'react';
import PropTypes from 'prop-types';
import 'react-devtools';

//JS libraries
import {updateTabs,getTabs,setTabCountInBadge} from './components/browserActions';
import {sortTabs,log} from './components/general.js';

// React Components
import Search from './components/Header/Search/index';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import WindowSelector from "./components/WindowSelector";

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

//Images
let logo;
env.NODE_ENV === 'production'? logo = require('../images/logo.svg'): logo = require('../images/dev-logo.svg');

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
      preferences: this.props.preferences,
      tabs:  window.tabs ?  window.tabs : [],
      client: this.props.client,
      NODE_ENV: this.props.NODE_ENV
    };
    this.setPreferences= this.setPreferences.bind(this);
    this.searchInTabs= this.searchInTabs.bind(this);
    log("Activetabs.js constructor:",this.state.preferences,this.props.preferences)
  }
  sortBy(parameter){
    sortTabs( parameter);
  }
  filterTabs(){
    if(window.searchTerm=="") return window.tabs;
    let filteredTabs =  window.tabs.filter(tab => {
      if (this.state.preferences.search.regex) {
        let regex = new RegExp(window.searchTerm, this.state.preferences.search.ignoreCase? 'i':'');
        if(this.state.preferences.search.searchIn[0]){if (regex.test(tab.title)) return true;}
        if(this.state.preferences.search.searchIn[1]){if (regex.test(tab.url)) return true;}
      } else {
        if(this.state.preferences.search.searchIn[0]){return tab.title.indexOf(window.searchTerm) >= 0;}
        if(this.state.preferences.search.searchIn[1]){return tab.url.indexOf(window.searchTerm) >= 0;}
      }
    });
    return filteredTabs;
  }
  searchInTabs(searchTerm) {
    window.searchTerm = searchTerm;
    this.forceUpdate();
  }
  componentWillMount(){

  }
  componentDidMount() {
      this.setState({tabs:window.tabs});
  }
  componentWillReceiveProps(props) {
    this.setState({tabs: props.tabs});
  }
  setPreferences(prefSection,key,value){
    console.log("set pref:",prefSection,key,value);

    client.storage.local.get('preferences')
      .then((result)=>{
        console.log("getting stored pref:",result);
        let jsonObj = result;
        jsonObj['preferences'][prefSection][key] = value;
        console.log(jsonObj.preferences.search.searchIn);
        client.storage.local.set(jsonObj)
          .then((tempResult)=> {
            console.log("saving pref:",tempResult);
            client.notifications.create(
              "reminder", {
                type: "basic",
                iconUrl: "../images/logo.svg",
                title: "Settings Saved",
                message: "Search settings updated"
              },
              function(notificationId) {}
            );
          });
      });


  }
  render() {
    console.log("active tabs render method",this.state.tabs);
    console.log(this.state.NODE_ENV);
      return [
        <header className="page-header" key={1}>
          <nav className="navbar">
            <div className="navbar-brand ">
              <a href="#" className="pull-left logo" style={{marginTop: "10px"}}>
                <img src={logo} alt="" style={{height:"40px",width:"auto"}} />
              </a>
              <div id="go-to-tabs">
                Tabs <span className={`active-tab-counter badge ` + (this.state.tabs.length > 50 ?'badge-danger':'badge-success')}>{this.state.tabs.length?this.state.tabs.length:''}</span>
                <span className="sr-only">(current)</span>
              </div>
            </div>
            {log("Active Tabs render preferences",this.state.preferences)}
            <Search
              regex={this.state.preferences.search.regex}
              ignoreCase={this.state.preferences.search.ignoreCase}
              searchIn={this.state.preferences.search.searchIn}
              searchInTabs={this.searchInTabs}
              setPreferences={this.setPreferences}
            />
          </nav>
          <section className="context-actions container-fluid">
            <ul className="nav nav-pills pull-left">
              {/*<li className="nav-item" >*/}
                {/*<div className="nav-link custom-checkbox-container">*/}
                  {/*<div className="custom-control custom-checkbox ">*/}
                    {/*<input type="checkbox" className="custom-control-input" id="checkall" />*/}
                      {/*<label className="custom-control-label input-group-text" htmlFor="checkall">Check All</label>*/}
                  {/*</div>*/}
                {/*</div>*/}
              {/*</li>*/}
              <li role="presentation" className="nav-item">
                <a className="nav-link refreshActiveTabs" title="Refresh Active Tabs" href='#' onClick={()=> {updateTabs()}}>
                  <i className="fas fa-sync-alt fa-fw fa-sm" /> Refresh
                </a>
              </li>

              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href='#' title="Rearrange/Sort Tabs" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fas fa-sort fa-fw" /> Rearrange by
                </a>
                <div className="dropdown-menu">
                  <a className="dropdown-item" id="rearrange-url-btn" href="#" title="Rearrange with respect of URL" onClick={this.sortBy.bind(null,'url')}>URL</a>
                  <a className="dropdown-item" id="rearrange-title-btn" href="#" title="Rearrange with respect of Title" onClick={this.sortBy.bind(null,'title')}>Title</a>
                </div>
              </li>
              <WindowSelector />
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
        <div className={'tabs-list-container'} key={2}>

          <Tabsgroup tabs={this.filterTabs()} client={this.props.client} preferences={this.props.preferences}/>
        </div>
      ];
  }
}

