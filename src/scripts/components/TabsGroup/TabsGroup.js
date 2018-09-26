import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './Tab';
let client = browser;
let tab;
let config = {
  promptForClosure :true
}
export default class TabsGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: this.props.tabs,
      selectedTabs: []
    };
    this.closeTab = this.closeTab.bind(this);
    this.staticList = this.staticList.bind(this);
    this.updateSelectedTabs = this.updateSelectedTabs.bind(this);
  }
  updateSelectedTabs(id,selected){
    let tempArray = this.state.selectedTabs;
    selected ? tempArray.splice(tempArray.indexOf(id),1) : tempArray.push(id) ;
    this.setState({selectedTabs: tempArray});
  }
  closeTab(key,promptForClosure = config.promptForClosure) {
    console.log(promptForClosure);
    let newtabs = [...this.state.tabs];
    if(promptForClosure) {if (!confirm(`Are you sure you want to close the following tab\n` + key)) return false;}
      client.tabs.remove(parseInt(key));
      newtabs.splice(newtabs.findIndex(el => el.id === key), 1);
      this.setState({ tabs: newtabs });

  }
  pinTab(tabId, pinned) {
    // !pinned ? client.tabs.update(tabId, { pinned: true }) : client.tabs.update(tabId, { pinned: false });
    // this.setState({ pinned: !pinned });
  }
  muteTab(id) {
    client.tabs.update(this.state.id, { muted: this.state.audible });
    // this.setState({ audible: !this.state.audible });
    // this.setState({ muted: !this.state.muted });
  }
  processSelectedTabs(action){
    if ( action == 'close' ){
      if(!confirm('Are you sure you want to close selected tabs')) return false;
      for (let id of this.state.selectedTabs) this.closeTab(id,false);
    }
    if ( action == 'pin' ) for (let id of this.state.selectedTabs) this.pinTab(id);
    if ( action == 'mute' ) for (let id of this.state.selectedTabs) this.muteTab(id);
  }


  componentDidMount() {
    // client.tabs.query({}, tabs => {
    //   // this.setState({ tabs: tabs });
    // });
  }

  staticList() {
    console.log('Tabsgroup.js: staticList', this.state.tabs);
    tab = this.state.tabs.map(function(tab) {
      return (
        <CSSTransition
          transitionName="example"
          classNames="example"
          transitionAppear={true}
          key={tab.index}
          timeout={{ enter: 500, exit: 500 }}
        >
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
            favIconUrl={tab.favIconUrl}
            status={tab.status}
            data={tab}
            closeTab={this.closeTab}
            pinTab={this.pinTab}
            muteTab={this.muteTab}
            updateSelectedTabs={this.updateSelectedTabs}
          />
        </CSSTransition>
      );
    }, this);
    return tab;
  }
  render() {
    console.log('Tabsgroup.js: Rendering');
    return (
      <TransitionGroup component="ul" className="tab tabs-list sortable selectable">
        {this.staticList()}
      </TransitionGroup>
    );
  }
}
TabsGroup.propTypes = {
  tabs: React.PropTypes.array.isRequired,
};
TabsGroup.defaultProps = {
  tabs: [],
};
