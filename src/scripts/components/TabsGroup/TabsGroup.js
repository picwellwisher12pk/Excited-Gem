import React from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Tab from './Tab';
let client = browser;
let tab;
export default class TabsGroup extends React.Component {
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
      newtabs.splice(newtabs.findIndex(el => el.id === key), 1);
      this.setState({ tabs: newtabs });
    }
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
