import $ from "jquery";
import React from "react";
import packagedAndBroadcast from "../components/communications.js";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Tab from "./tab-unit.rc.jsx";
let client = browser;
export default class ActiveTabs extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        tabs: this.props.tabs
      };
      this.closeTab = this.closeTab.bind(this);
      this.renderComponent = this.renderComponent.bind(this);
    }

    closeTab (key) {
      const tabs = { ...this.state.tabs };
      if (confirm(`Are you sure you want to close the following tab\n` + key)) {
        client.tabs.remove(parseInt(key));
        tabs[key] = null;
        client.tabs.query({}, tabs => {
          console.log("New tabs", this, tabs);
          this.setState({ tabs: tabs });
        });
      }
    }
    componentDidMount(){
      client.tabs.query({}, tabs => {
            this.setState({ tabs: tabs });
          }
      );
    }
    render() {

      console.log("tabs.rc.jsx BEFORE map function",this.state.tabs);
      if(this.state.tabs) return (<ul className="tabs-list sortable selectable">
          {this.state.tabs.map(function(tab) {
            console.log("tabs.rc.jsx INSIDE map function",tab.id,tab.title);
            return <Tab
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
            closeTab={this.closeTab}/> ;
          },this)}
        </ul>);
    }
  }
ActiveTabs.propTypes = {
    tabs: React.PropTypes.array.isRequired
};
ActiveTabs.defaultProps = {
    tabs: []
};
