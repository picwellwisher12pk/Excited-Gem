import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import packagedAndBroadcast from "../components/communications.js";
import InfoModal from "./infomodal.jsx";
const sender = "content";
let info = ReactDOM.render(<InfoModal />,document.getElementById('infoModal'));
export default class Tab extends React.Component{
   constructor(props) {
    super(props);
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
    closeTab(id,title){
        if(confirm(`Are you sure you want to close the following tab\n`+(title)))
            {packagedAndBroadcast(sender,"background","closeTab",id);}
    }
    infoModal(dataV){
        console.log("trigger infoModal",this,dataV);
        info.setState({
            data:dataV
        });
        jQuery('#infoModal').modal('show');
    }
    render(){


        let _this = this;
        let url = _this.state.url;
        // let length = -1;
        // let trimmedURL = url.substring(0, length);
        let trimmedURL = url;
        return (
            <li key={_this.props.id} data-id={_this.props.id} className="tab-item">
                    {/* <div className="btn-group"  role="toolbar" aria-label="site"> */}
                        {/* <button type="button" className={`btn btn-default clickable glyphicon glyphicon-pushpin pinned`+(_this.state.pinned ? ` `: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned">
                        </button>
                        <button type="button" role="group" aria-label="audible"className = {`btn btn-default clickable glyphicon glyphicon-volume-off audible`+(_this.state.audible ? ` `: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true'>
                        </button> */}
                        <span className="tab-favicon" aria-label="favicon">
                            <img src={_this.state.favicon}/>
                        </span>
                        <a title={url} className="clickable tab-name" onClick={_this.focusTab.bind(null,_this.props.id)}>
                        {_this.state.title}
                        </a>
                        <span className="tab-url trimmed dimmed">{url}</span>
                    {/* </div> */}
                    <ul className=" tab-actions" role="group" aria-label="options">
                        <li title="Tab Information"  className="active clickable" onClick={_this.infoModal.bind(null,_this.state.data)} >
                            <img src="images/info-icon.svg" alt="" />
                        </li>
                        <li title="Un/Pin Tab" className={`clickable`+(_this.state.pinned ? ` active`: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned" >
                            <img src="images/pin-icon.svg" alt="" />
                        </li>
                        {/* This will not appear as status icon instead this will be just a button to trigger pin or unpin */}
                        <li title="Un/Mute Tab" className={`clickable`+(_this.state.audible ? ` active`: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true' >
                            <img src="images/sound-icon.svg" alt="" />
                        </li>
                        <li title="Close Tab" className='clickable remove-tab' data-id={_this.props.id} onClick={_this.closeTab.bind(null,_this.props.id,_this.state.title)} data-command='remove' aria-hidden='true'>
                            <svg stroke-linejoin="round" clip-rule="evenodd" fill-rule="evenodd" height="16" width="16" stroke-miterlimit="1.4142"viewBox="0 0 16 17">
                                <path id="Close-Circle-Icon" d="m8 16.678c-4.418 0-8-3.581-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.419-3.582 8-8 8zm2.831-10.843c-0.388-0.388-1.017-0.388-1.405 0l-1.432 1.432-1.433-1.432c-0.388-0.388-1.017-0.388-1.405 0s-0.388 1.017 0 1.405l1.433 1.432-1.433 1.433c-0.388 0.387-0.388 1.017 0 1.405s1.017 0.388 1.405 0l1.433-1.433 1.432 1.433c0.388 0.388 1.017 0.388 1.405 0s0.388-1.018 0-1.405l-1.433-1.433 1.433-1.432c0.388-0.388 0.388-1.017 0-1.405z" />
                            </svg>
                        </li>
                    </ul>
           </li>
            )

    }
}
