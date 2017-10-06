import $ from "jquery";
import React from "react";
import packageAndBroadcast from "../components/communications.jsx";
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
        console.log("inside open",id);
        packageAndBroadcast(sender,"background","focusTab",id);
    }
    pinTab(id,pinned){
        console.info(id,pinned);
        pinned ? packageAndBroadcast(sender,"background","unpinTab",id) : packageAndBroadcast(sender,"background","pinTab",id)
        this.setState({pinned:!pinned});
    }
    muteTab(id,audible){
        audible ? packageAndBroadcast(sender,"background","muteTab",id) : packageAndBroadcast(sender,"background","unmuteTab",id)
        this.setState({audible:!audible});
    }
    componentWillReceiveProps(){
        // console.log(this.props)
    }
    closeTab(id,title){
        if(confirm(`Are you sure you want to close the following tab\n`+(title)))
            {packageAndBroadcast(sender,"background","closeTab",id);}
    }
    infoModal(dataV){
        console.log("trigger infoModal",this,dataV);
        InfoModal.setState({
            data:dataV
        });
        jQuery('#infoModal').modal('show');
    }
    render(){


        let _this = this;
        let url = _this.state.url;
        return (
            <li key={_this.props.id} data-id={_this.props.id} className="ui-widget-content list-group-item horizontal-block">
                <div className="btn-group"  role="toolbar" aria-label="site">
                    <button type="button" className={`btn btn-default clickable glyphicon glyphicon-pushpin pinned`+(_this.state.pinned ? ` `: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned">
                    </button>
                    <button type="button" role="group" aria-label="audible"className = {`btn btn-default clickable glyphicon glyphicon-volume-off audible`+(_this.state.audible ? ` `: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true'>
                    </button>
                    <div className="btn btn-default favicon" role="group" aria-label="favicon">
                        <img src={_this.state.favicon}/>
                    </div>
                    <button type="button" role="group" aria-label="title" title={url} className="btn btn-default clickable site-name" onClick={_this.focusTab.bind(null,_this.props.id)}>
                        {_this.state.title}
                    </button>
                </div>
                <div className="options pull-right btn-group" role="group" aria-label="options">
                    <div className="btn btn-default glyphicon glyphicon-option-vertical clickable" onClick={_this.infoModal.bind(null,_this.state.data)} ></div>
                    <div className='btn btn-default clickable remove-tab glyphicon glyphicon-remove' data-id={_this.props.id} onClick={_this.closeTab.bind(null,_this.props.id,_this.state.title)} data-command='remove' aria-hidden='true'></div>
                </div>
           </li>
            )

    }
}
