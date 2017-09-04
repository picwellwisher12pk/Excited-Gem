                    // glyphicon glyphicon-option-vertical
                    // glyphicon glyphicon-menu-down
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


class Tab extends React.Component{
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
                <div className="container-fluid">
                    <div className="btn-group"  role="toolbar" aria-label="site">
                        {/* <button type="button" className={`btn btn-default clickable glyphicon glyphicon-pushpin pinned`+(_this.state.pinned ? ` `: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned">
                        </button>
                        <button type="button" role="group" aria-label="audible"className = {`btn btn-default clickable glyphicon glyphicon-volume-off audible`+(_this.state.audible ? ` `: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true'>
                        </button> */}
                        <span className="favicon" role="group" aria-label="favicon">
                            <img src={_this.state.favicon}/>
                        </span>
                        <a type="button" role="group" aria-label="title" title={url} className="clickable site-name" onClick={_this.focusTab.bind(null,_this.props.id)}>
                            {_this.state.title}
                        </a>
                    </div>
                    <ul className="nav nav-pills options pull-right btn-group tabs-context-buttons" role="group" aria-label="options">
                        <li title="Tab Information"  className=" clickable" onClick={_this.infoModal.bind(null,_this.state.data)} >
                            <img src="images/info-icon.svg" alt="" />
                        </li>
                        <li title="Un/Pin Tab" className={`clickable`+(_this.state.pinned ? ` active`: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned" >
                            <img src="images/pin-icon.svg" alt="" />
                        </li>
                        <li title="Un/Mute Tab" className=" clickable" onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true' >
                            <img src="images/sound-icon.svg" alt="" />
                        </li>
                        <li title="Close Tab" className=' clickable remove-tab' data-id={_this.props.id} onClick={_this.closeTab.bind(null,_this.props.id,_this.state.title)} data-command='remove' aria-hidden='true'>
                            <img src= 'images/close-icon.svg' />
                        </li>
                    </div>
                </div>
           </li>
            )
        
    }
}

class InfoModal extends React.Component {
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
        let data = this.state.data;
        // console.group("Rendering");
        console.log("rendering infoModal",data.length,"items",data);
        
        return (
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                           <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" className="glyphicon glyphicon-remove"></span></button>
                            <h4 className="modal-title" id="myModalLabel">
                                <img src={_this.state.data.favIconUrl}/> 
                                {this.state.data.title}
                            </h4>
                          </div>
                          <div className="modal-body">
                           <p><strong>ID :</strong> {this.state.data.id}</p>
                           <p><strong>Index(position) :</strong> {this.state.data.index}</p>
                           <p><strong>URL :</strong> {this.state.data.url}</p>
                           <p><strong>Title :</strong> {this.state.data.title}</p>
                           <p><strong>Status :</strong> {this.state.data.status}</p>
                           <p><strong>Pinned :</strong> {this.state.data.pinned ? "Yes" : "No"}</p>
                           <p><strong>Audible :</strong> {this.state.data.audible ? "Yes" : "No"}</p>
                           <p><strong>Active :</strong> {this.state.data.active ? "Yes" : "No"}</p>
                           <p><strong>Selected :</strong> {this.state.data.selected ? "Yes" : "No"}</p>
                           <p><strong>Width :</strong> {this.state.data.width}</p>
                           <p><strong>Height :</strong> {this.state.data.height}</p>
                           <p><strong>WindowID :</strong> {this.state.data.windowId}</p>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                          </div>
                        </div>
                      </div>
            )
    }

  }

InfoModal.propTypes = {
 data: React.PropTypes.array.isRequired
};
InfoModal.defaultProps= {
        data: []
};