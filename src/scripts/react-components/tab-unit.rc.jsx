import React from "react";
import packagedAndBroadcast from "../components/communications.js";
// import InfoModal from "./infomodal.jsx";
const sender = "content";
// let info = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
export default class Tab extends React.Component{
   constructor(props) {
    super(props);
    console.log("props inherited",this.props);
    this.state = {
        url: this.props.url,
        title: this.props.title,
        pinned: this.props.pinned,
        position: this.props.position,
        favicon: this.props.favIconUrl,
        audible: this.props.audible,
        status: this.props.status,
        data: this.props.data
        };
    }
    focusTab(id){
        console.info("opening ID: ",id);
        packagedAndBroadcast(sender,"background","focusTab",id);
    }
    pinTab(id,pinned){
        console.info(id,pinned);
        pinned ? packagedAndBroadcast(sender,"background","unpinTab",id) : packagedAndBroadcast(sender,"background","pinTab",id)
        this.setState({pinned:!pinned});
    }
    muteTab(id,audible){
        audible ? packagedAndBroadcast(sender,"background","muteTab",id) : packagedAndBroadcast(sender,"background","unmuteTab",id)
        this.setState({audible:!audible});
    }
    componentWillReceiveProps(){
        // console.log(this.props)
    }

    // infoModal(dataV){
    //     console.log("trigger infoModal",this,dataV);
    //     info.setState({
    //         data:dataV
    //     });
    //     jQuery('#infoModal').modal('show');
    // }
    // closeTab(id){
    //     console.log(this,id);
    //     this.props.closeTab(id,this.props.parent);
    // }
    render(){

        console.log("sate of tab UNIT:",this.state);
        // let _this = this;
        let url = this.state.url;
        // let length = -1;
        // let trimmedURL = url.substring(0, length);
        let trimmedURL = url;
        return <li key={this.props.id} data-id={this.props.id} className="tab-item">
            <span className="tab-favicon" aria-label="favicon">
              <img src={this.state.favicon} />
            </span>
            <a title={url} className="clickable tab-name" onClick={this.focusTab.bind(null, this.props.id)}>
              {this.state.title}
            </a>
            <span className="tab-url trimmed dimmed">{url}</span>
            {/* </div> */}
            <ul className=" tab-actions" role="group" aria-label="options">
              <li title="Tab Information" className="clickable">
                {/* onClick={this.infoModal.bind(null, this.state.data)} */}
                <i className="fa fa-info-circle fw-fw" />
              </li>
              <li title="Un/Pin Tab" className={`clickable` + (this.state.pinned ? ` active` : ` disabled`)} onClick={this.pinTab.bind(this, this.props.id, this.state.pinned)} aria-hidden="true" role="group" aria-label="pinned">
                <i className="fa fa-thumbtack fw-fw" />
              </li>

              {/* This will not appear as status icon instead this will be just a button to trigger pin or unpin */}
              <li title="Un/Mute Tab" className={`clickable` + (this.state.audible ? ` active` : ` disabled`)} onClick={this.muteTab.bind(this, this.props.id, this.state.audible)} aria-hidden="true">
                <i className="fa fa-volume-up fw-fw" />
              </li>

              <li title="Close Tab" className="clickable remove-tab" data-id={this.props.id} onClick={() => this.props.closeTab(this.props.id)} data-command="remove" aria-hidden="true">
                <i className="fa fa-times-circle fw-fw" />
              </li>
            </ul>
          </li>;

    }
}
