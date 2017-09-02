import $ from "jquery";
import React from "react";
import packageAndBroadcast from "../components/communications";
import Tab from "./tabListItem";
import InfoModal from "./infomodal";
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
        // console.group("Rendering");
        // console.log("rendering",activeTabs.length,"items",activeTabs);


        return (<ul className="tabs-list list-group sortable selectable">
                {activeTabs.map(function(value) {
                    // console.log("rendering li",value.title);
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
