import $ from "jquery";
import React from "react";
import packagedAndBroadcast from "../components/communications.js";
import Tab from "./tabListItem.jsx";

export default class ActiveTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: this.props.data
    };
   }

    handleClick() {
        console.log(this); // null
    }

    render() {
        let _this = this;
        let activeTabs = this.state.data;
        console.log(activeTabs);
        return (<ul className="tabs-list sortable selectable">
                {activeTabs.map(function(value) {
                    return <Tab key={value.id} id={value.id} pinned={value.pinned} audible={value.audible} position={value.index} url={value.url} title={value.title} favIconUrl={value.favIconUrl} status={value.status} data={value}/>
                })}

            </ul>
            );
  }
}
ActiveTabs.propTypes = {
 data: React.PropTypes.array.isRequired
};
ActiveTabs.defaultProps= {
        data: []
};
