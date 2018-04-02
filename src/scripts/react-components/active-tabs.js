import React from 'react';
// import packagedAndBroadcast from '../components/communications.js';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './tab.js';
import dummytabs from '../dummydata.json';
let client = browser;
class ActiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: this.props.tabs,
    };
    this.closeTab = this.closeTab.bind(this);
    this.staticList = this.staticList.bind(this);
  }

  closeTab(key) {
    let newtabs = [...this.state.tabs];
    if (confirm(`Are you sure you want to close the following tab\n` + key)) {
      client.tabs.remove(parseInt(key));
      // newtabs[key] = null;
      newtabs.splice(newtabs.findIndex(el => el.id === key), 1);
      this.setState({ tabs: newtabs });
    }
  }
  componentDidMount() {
    // this.setState({ tabs: dummytabs });
    client.tabs.query({}, tabs => {
      this.setState({ tabs: tabs });
    });
  }
  animatedList() {
    return (
      <CSSTransition
        transitionName="example"
        classNames="example"
        transitionAppear={true}
        key={tab.index}
        timeout={{ enter: 500, exit: 500 }}
      >
        {this.state.tabs.map(function(tab) {
          return (
            <Tab
              id={tab.id}
              indexkey={tab.id}
              key={tab.id}
              pinned={tab.pinned}
              audible={tab.audible}
              position={tab.index}
              url={tab.url}
              title={tab.title}
              favIconUrl={tab.favIconUrl}
              status={tab.status}
              data={tab}
              closeTab={this.closeTab}
            >
              Test{' '}
            </Tab>
          );
        }, this)}{' '}
      </CSSTransition>
    );
  }
  staticList() {
    console.log('staticList', this.state.tabs);
    let tabs = this.state.tabs.map(function(tab) {
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
            position={tab.index}
            url={tab.url}
            title={tab.title}
            favIconUrl={tab.favIconUrl}
            status={tab.status}
            data={tab}
            closeTab={this.closeTab}
          />{' '}
        </CSSTransition>
      );
    }, this);
    return tabs;
  }
  render() {
    return (
      <TransitionGroup component="ul" className="tab tabs-list sortable selectable">
        {' '}
        {this.staticList()}{' '}
      </TransitionGroup>
    );
  }
}
ActiveTabs.propTypes = {
  tabs: React.PropTypes.array.isRequired,
};
ActiveTabs.defaultProps = {
  tabs: [],
};
export default ActiveTabs;
