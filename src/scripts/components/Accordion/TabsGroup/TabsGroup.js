import React from 'react';
import PropTypes from 'prop-types';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './Tab/index';
import {getTabs} from '../../browserActions';
import {log} from '../../general';
let tab;

export default class TabsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: this.props.tabs ? this.props.tabs : [],
      client: this.props.client,
      preferences: this.props.preferences,
      selectedTabs: []
    };
    this.closeTab = this.closeTab.bind(this);
    this.togglePin = this.togglePin.bind(this);
    this.animatedList = this.animatedList.bind(this);
    this.tabTemplate = this.tabTemplate.bind(this);
    this.render = this.render.bind(this);
    this.updateSelectedTabs = this.updateSelectedTabs.bind(this);
  }
  updateSelectedTabs(id,selected){
    let tempArray = this.state.selectedTabs;
    selected ? tempArray.splice(tempArray.indexOf(id),1) : tempArray.push(id) ;
    tempArray.length>0 ? $('#selection-action').addClass('active') : $('#selection-action').removeClass('active');
    this.setState({selectedTabs: tempArray});
  }
  //Close
  closeTab(key,promptForClosure = this.state.preferences.promptForClosure) {
    let newtabs = [...this.state.tabs];
    if(promptForClosure) {if (!confirm(`Are you sure you want to close the following tab\n` + key)) return false;}
      client.tabs.remove(parseInt(key));
      newtabs.splice(newtabs.findIndex(el => el.id === key), 1);
      getTabs().then(tabs=>{this.setState({tabs:tabs}); this.forceUpdate();}, error => log(`Error: ${error}`));
  }
  //Pinned
  pinTab(tabId) {
    console.info("pinning");
    client.tabs.update(tabId, { pinned: true });
    // let tabs = this.state.tabs;
    // let index = tabs.findIndex(tab => tab.id == tabId);
    // console.log(`${tabId} = ${tabs[index].id}`,tabs[index].pinned);
    // tabs[index].pinned = true;
    // console.log(`${tabId} = ${tabs[index].id}`,tabs[index].pinned);
    // this.setState({tabs});
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));
  }
  unpinTab(tabId){
    log("unpinning");
    client.tabs.update(tabId, { pinned: false });
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));

  }
  togglePin(tabId){
    let tab = this.state.tabs.filter(tab => tab.id == tabId);
    tab[0].pinned ? this.unpinTab(tabId) : this.pinTab(tabId);
  }

  //Muted or Not
  muteTab(id){
    client.tabs.update(parseInt(id), { muted: true});
  }
  unmuteTab(id){
    client.tabs.update(parseInt(id), { muted: false});
  }
  toggleMute(id) {
    client.tabs.get(id).then(tab=> {
      client.tabs.update(parseInt(id), { muted: ! tab.mutedInfo.muted});
    });
    getTabs().then(tabs=>{this.setState({tabs:tabs})}, error => log(`Error: ${error}`));
   }
  processSelectedTabs(action){
    //close
    if ( action == 'close' ){
      if(!confirm('Are you sure you want to close selected tabs')) return false;
      for (let id of this.state.selectedTabs) this.closeTab(id,false);
    }
    //Pin
    if ( action == 'pinSelected' ) for (let id of this.state.selectedTabs) this.pinTab(id);
    if ( action == 'unpinSelected' ) for (let id of this.state.selectedTabs) this.unpinTab(id);
    if ( action == 'togglePin' ) for (let id of this.state.selectedTabs) this.togglePin(id);

    //Mute
    if ( action == 'muteSelected' ) for (let id of this.state.selectedTabs) this.muteTab(id);
    if ( action == 'unmuteSelected' ) for (let id of this.state.selectedTabs) this.unmuteTab(id);
  }


  componentDidMount() {
    console.log("tabsgroup mounted:",this.state.tabs);
    // if(!this.props.tabs){
    //   getTabs().then(tabs=>
    //     {
    //       this.setState({tabs:tabs});
    //       this.forceUpdate();
    //     },
    //     error => log(`Error: ${error}`));}
    // else{
    //   this.setState({tabs:this.props.tabs});
    // }

  }
  componentWillReceiveProps(props) {
    this.setState({tabs: props.tabs});
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
      data={tab}
      closeTab={this.closeTab}
      togglePin={this.togglePin}
      toggleMute={this.toggleMute}
      updateSelectedTabs={this.updateSelectedTabs}
    />
  }
  animatedList() {
    tab = this.state.tabs.map(function(tab) {
    if(tab.index==5) console.log('Tabsgroup.js: animatedList', this.state.preferences.tabsTransition,tab.title,tab.pinned,tab.status);
      return (
        <CSSTransition
          transitionName="example"
          classNames="example"
          transitionAppear={true}
          key={tab.index}
          timeout={{ enter: 500, exit: 500 }}
        >
          {this.tabTemplate(tab)}
        </CSSTransition>
      );
    }, this);
    return tab;
  }
  staticList() {
    tab = this.state.tabs.map(function(tab) {
      if(tab.index>5 && tab.index<10) log('Tabsgroup', tab.title,tab.pinned,tab.status);
      {this.tabTemplate(tab)}
    }, this);
    return tab;
  }
  render() {
    log("tabsgroup.js: render method",this.state.tabs);
    if(this.state.tabs == null || this.state.tabs == undefined ) return ["Loading tabs..."];
    if(this.state.preferences.tabsGroup.tabsListAnimation){
      log("Tabsgroup, render method");
      return (
        <TransitionGroup component="ul" className="tab tabs-list sortable selectable">
          {this.animatedList()}
        </TransitionGroup>
      );
    }
    else{
      return (
        <ul className="tab tabs-list sortable selectable">
          {this.staticList()}
        </ul>
      );
    }


  }
}
TabsGroup.propTypes = {
  tabs: PropTypes.array,
};
TabsGroup.defaultProps = {
  tabs: [],
};
