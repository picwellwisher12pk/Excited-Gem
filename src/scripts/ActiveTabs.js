//Scripts and Modules
import {preferences} from "./defaultPreferences";
const bootstrap = require('bootstrap');
// const debug = require('debug')('activetabs');
import React from 'react';
import PropTypes from 'prop-types';
import 'react-devtools';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

//JS libraries
import {updateTabs,getTabs} from './components/browserActions';
import {sortTabs} from './components/general.js';

// React Components
import Search from './components/Header/Search/index';
import Tabsgroup from './components/Accordion/TabsGroup/index';
import Tab from './components/Accordion/TabsGroup/Tab/index';
import WindowSelector from "./components/WindowSelector";
import ErrorBoundary from "./ErrorBoundary";

//Styles
import '../styles/fontawesome5/fa-solid.scss';
import '../styles/fontawesome5.scss';
import '../styles/eg.scss';

//Images
let logo;
NODE_ENV === 'production'? logo = require('../images/logo.svg'): logo = require('../images/dev-logo.svg');
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
      selectedTabs:[],
      allMuted:false
    };
    this.setPreferences= this.setPreferences.bind(this);
    this.closeTab= this.closeTab.bind(this);
    this.searchInTabs= this.searchInTabs.bind(this);
    this.updateSelectedTabs= this.updateSelectedTabs.bind(this);
  }
  updateSelectedTabs(id,selected){
    let tempArray = this.state.selectedTabs;
    selected ? tempArray.splice(tempArray.indexOf(id),1) : tempArray.push(id) ;
    tempArray.length>0 ? $('#selection-action').addClass('active') : $('#selection-action').removeClass('active');
    this.setState({selectedTabs: tempArray});
  }
  //Close
  closeTab(key,promptForClosure = this.state.preferences.promptForClosure) {
    if(promptForClosure) {if (!confirm(`Are you sure you want to close the following tab\n` + key)) return false;}
    browser.tabs.remove(parseInt(key));

  }
  //Pinned
  pinTab(tabId) {
    console.info("pinning");
    browser.tabs.update(tabId, { pinned: true });
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));
  }
  unpinTab(tabId){
    log("unpinning");
    browser.tabs.update(tabId, { pinned: false });
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));

  }
  togglePin(tabId){
    let tab = this.state.tabs.filter(tab => tab.id == tabId);
    tab[0].pinned ? this.unpinTab(tabId) : this.pinTab(tabId);
  }

  //Muted or Not
  muteTab(id){
    browser.tabs.update(parseInt(id), { muted: true});
  }
  unmuteTab(id){
    browser.tabs.update(parseInt(id), { muted: false});
  }
  toggleMute(id) {
    browser.tabs.get(id).then(tab=> {
      browser.tabs.update(parseInt(id), { muted: ! tab.mutedInfo.muted});
    });
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));
  }
  processSelectedTabs(action,selection = this.state.selectedTabs){
    //close
    if ( action == 'closeSelected' ){
      let message = 'Are you sure you want to close selected tabs';
      if(selection.length == this.state.tabs.length) message = 'Are you sure you want to close all the tabs? This will also close this window.';
      if(!confirm(message)) return false;
      for (let id of selection) this.closeTab(id,false);
      this.setState({selectedTabs:[]});
      $('#selection-action').removeClass('active');
      console.log("processSelectedTabs",this,this.state.selectedTabs);

    }
    //Pin
    if ( action == 'pinSelected' ) for (let id of selection) this.pinTab(id);
    if ( action == 'unpinSelected' ) for (let id of selection) this.unpinTab(id);
    if ( action == 'togglePin' ) for (let id of selection) this.togglePin(id);

    //Mute
    if ( action == 'toggleMuteSelected' ) for (let id of selection) !this.state.allMuted ?this.muteTab(id):this.unmuteTab(id);
    if ( action == 'muteSelected' ) for (let id of selection) this.muteTab(id);
    if ( action == 'unmuteSelected' ) for (let id of selection) this.unmuteTab(id);
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
  componentDidMount(a,b) {
    // console.log("active tab mounted",a,b);
    this.setState({tabs:window.tabs});
    this.setState({preferences:this.props.preferences});
  }
  componentDidUpdate(a,b){
    console.log("active tab updated",a,b);
    // this.setState({tabs:window.tabs});
    // this.setState({preferences:this.props.preferences});
  }
  static getDerivedStateFromProps(nextProps, prevState) {
   // console.log("ActiveTabs.js getDerivedStateFromProps:",nextProps, prevState);
    return prevState;
  }

  setPreferences(prefSection,key,value){
   console.log("set pref:",prefSection,key,value);

    browser.storage.local.get('preferences')
      .then((result)=>{
       console.log("getting stored pref:",result);
        let jsonObj = result;
        jsonObj['preferences'][prefSection][key] = value;
       console.log(jsonObj.preferences.search.searchIn);
        browser.storage.local.set(jsonObj)
          .then((tempResult)=> {
           console.log("saving pref:",tempResult);
            browser.notifications.create(
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
  tabTemplate(tab){
    return <Tab
      id={tab.id}
      indexkey={tab.id}
      key={tab.id}
      pinned={tab.pinned}
      audible={tab.audible}
      muted={tab.mutedInfo.muted}
      position={tab.index}
      url={tab.url}
      title={tab.title}
      favIconUrl={tab.favIconUrl}
      status={tab.status}
      closeTab={this.closeTab}
      togglePin={this.togglePin}
      toggleMute={this.toggleMute}
      updateSelectedTabs={this.updateSelectedTabs}
    />
  }
  prepareTabList(){
      if(this.state.tabs == null || this.state.tabs == undefined ) return ["Loading tabs..."];
        return this.filterTabs().map((tab)=> {
          return (
            <CSSTransition
            transitionName="fade"
            classNames="fade"
            appear={this.state.preferences.tabsGroup.tabsListAnimation}
            exit={false}
            key={tab.id}
            timeout={{ enter: 200, exit:0 }} >
              {this.tabTemplate(tab)}
            </CSSTransition>
          );
        }, this);
  }
  render() {
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
            <Search
              regex={this.state.preferences.search.regex}
              ignoreCase={this.state.preferences.search.ignoreCase}
              searchIn={this.state.preferences.search.searchIn}
              searchInTabs={this.searchInTabs}
              setPreferences={this.setPreferences}
            />
          </nav>
          <section className="context-actions navbar container-fluid">
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
                <a className="nav-link refreshActiveTabs" title="Refresh Active Tabs" href='#' onClick={()=> {updateTabs();this.setState({tabs:window.tabs})}}>
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
            <ul className="nav nav-pills">
                <li><a href="#" onClick={(event)=> {
                    this.processSelectedTabs("toggleMuteSelected",this.state.tabs.map(tab=> tab.id));
                    this.setState({allMuted:!this.state.allMuted});

                }}>{this.state.allMuted? "Unmute All": "Mute All"}</a></li>
                <li style={{marginRight:0}}><a href="#" onClick={()=>this.processSelectedTabs('closeSelected',this.state.tabs.map(tab=> tab.id))}>Close All <i className="fa fa-times-circle fw-fw"></i></a></li>
              </ul>
          </section>
          <section className={`context-actions container-fluid selection-action navbar navbar-dark`} id="selection-action">
            <ul className="nav nav-pills pull-left">
              <li role="presentation" className="nav-item dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Selection of Tabs" className="dropdown-toggle">
                  Selection <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li className="dropdown-item"><a onClick={this.selectAll} href="#" title="Select All">Select All</a></li>
                  <li className="dropdown-item"><a onClick={this.selectNone} href="#" title="Clear Selection/ Select None">Select None </a></li>
                  <li className="dropdown-item"><a onClick={this.toggleSelection} href="#" title="Toggle Selection">Toggle/Invert Selection </a></li>
                </ul>
              </li>
              <li role="presentation" className="dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Unpin/Pin Selected Tabs" className="dropdown-toggle">
                  Unpin/Pin Selected <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li className="dropdown-item"><a onClick={this.pinSelected} href="#" title="Pin all selected tabs">Pin selected</a></li>
                  <li className="dropdown-item"><a onClick={this.unpinSelected} href="#" title="Unpin all selected tabs">Unpin selected </a></li>
                  <li className="dropdown-item"><a onClick={this.togglePinSelected} href="#" title="Toggle Pin selected tab">Toggle pin selected </a></li>
                </ul>
              </li>
              <li role="presentation" className="dropdown">
                <a data-toggle="dropdown" href="#" role="button" aria-haspopup="true" aria-expanded="false"
                   title="Unmute/Mute Selected Tabs" className="dropdown-toggle">
                  Unmute/Mute Selected <span className="caret"></span></a>
                <ul className="dropdown-menu">
                  <li className="dropdown-item"><a onClick={this.muteSelected} href="#" title="Mute all selected tabs">Mute selected</a></li>
                  <li className="dropdown-item"><a onClick={this.unmuteSelected} href="#" title="Unmute all selected tabs">Unmute selected </a></li>
                  <li className="dropdown-item"><a onClick={this.toggleMuteSelected} href="#" title="Toggle Mute selected tab">Toggle mute selected </a></li>
                </ul>
              </li>
              <li><a href="#" onClick={()=> this.processSelectedTabs('closeSelected')}>Close Selected</a></li>
            </ul>

          </section>
        </header>,
          <Tabsgroup preferences={this.props.preferences} tabs={this.state.tabs} key={2}>
            {this.filterTabs().map((tab)=> {
              console.log(tab.title);
                return (
                  <CSSTransition
                  transitionName="fade"
                  classNames="fade"
                  appear={this.state.preferences.tabsGroup.tabsListAnimation}
                  exit={false}
                  key={tab.id}
                  timeout={{ enter: 200, exit:0 }} >
                    {this.tabTemplate(tab)}
                  </CSSTransition>
                );
              }, this)
            }
          </Tabsgroup>
        ];
  }
}

ActiveTabs.propTypes = {
  preferences: PropTypes.object,
  tabs: PropTypes.array
};
