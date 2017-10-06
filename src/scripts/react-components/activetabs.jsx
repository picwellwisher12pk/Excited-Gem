import $ from "jquery";
import React from "react";
import packageAndBroadcast from "../components/communications.jsx";
import Tab from "./tabListItem.jsx";
import InfoModal from "./infomodal.jsx";
class ActiveTabs extends React.Component {
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
        return (<ul className="tabs-list list-group sortable selectable">
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
