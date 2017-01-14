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
        console.log("rendering",activeTabs.length,"items",activeTabs);
        

        return (<ul className="tabs-list list-group sortable">
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
            <li key={_this.props.id} data-id={_this.props.id} className="list-group-item horizontal-block">
                <div className="btn-group"  role="toolbar" aria-label="site">
                    <button type="button" className={`btn btn-default clickable glyphicon glyphicon-pushpin pinned`+(_this.state.pinned ? ` `: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true' role="group" aria-label="pinned">
                    </button>
                    <button type="button" role="group" aria-label="audible"className = {`btn btn-default clickable glyphicon glyphicon-volume-off audible`+(_this.state.audible ? ` `: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true'>
                    </button>
                    <div type="button" className="btn btn-default" role="group" aria-label="favicon">
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
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
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


    let Note = React.createClass({
        getInitialState: ()=>{
            return {editing: false}
        },
        componentWillMount: ()=>{
            this.style = {
                right: this.randomBetween(0, window.innerWidth - 150) + 'px',
                top: this.randomBetween(0, window.innerHeight - 150) + 'px',
                transform: 'rotate(' + this.randomBetween(-15, 15) + 'deg)'
            };
        },
        componentDidMount: ()=>{
            $(this.getDOMNode()).draggable();
        },
        randomBetween: (min, max)=>{
            return (min + Math.ceil(Math.random() * max));
        },
        edit: ()=>{
            this.setState({editing: true});
        },
        save: ()=>{
            this.props.onChange(this.refs.newText.getDOMNode().value, this.props.index);
            this.setState({editing: false});
        },
        remove: ()=>{
            this.props.onRemove(this.props.index);
        },
        renderDisplay: ()=>{
            return (
                <div className="note"
                    style={this.style}>
                    <p>{this.props.children}</p>
                    <span>
                        <button onClick={this.edit}
                                className="btn btn-primary glyphicon glyphicon-pencil"/>
                        <button onClick={this.remove}
                                className="btn btn-danger glyphicon glyphicon-trash"/>
                    </span>
                </div>
                );
        },
        renderForm: ()=>{
            return (
                <div className="note" style={this.style}>
                <textarea ref="newText" defaultValue={this.props.children}
                className="form-control"></textarea>
                <button onClick={this.save} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk" />
                </div>
                )
        },
        render: ()=>{
            if (this.state.editing) {
                return this.renderForm();
            }
            else {
                return this.renderDisplay();
            }
        }
    });

    let Board = React.createClass({
        propTypes: {
            count: function(props, propName) {
                if (typeof props[propName] !== "number"){
                    return new Error('The count property must be a number');
                }
                if (props[propName] > 100) {
                    return new Error("Creating " + props[propName] + " notes is ridiculous");
                }
            }
        },
        getInitialState: function() {
            return {
                notes: []
            };
        },
        nextId: function() {
            this.uniqueId = this.uniqueId || 0;
            return this.uniqueId++;
        },
        // componentWillMount: function() {
        //     let self = this;
        //     if(this.props.count) {
        //         $.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" +
        //             this.props.count + "&start-with-lorem=1&callback=?", function(results){
        //                 results[0].split('. ').forEach(function(sentence){
        //                     self.add(sentence.substring(0,40));
        //                 });
        //             });
        //     }
        // },
        add: function(text) {
            let arr = this.state.notes;
            arr.push({
                id: this.nextId(),
                note: text
            });
            this.setState({notes: arr});
        },
        update: function(newText, i) {
            let arr = this.state.notes;
            arr[i].note = newText;
            this.setState({notes:arr});
        },
        remove: function(i) {
            let arr = this.state.notes;
            arr.splice(i, 1);
            this.setState({notes: arr});
        },
        eachNote: function(note, i) {
            return (
                    <Note key={note.id}
                        index={i}
                        onChange={this.update}
                        onRemove={this.remove}
                    >{note.note}</Note>
                );
        },
        render: function() {
            return (<div className="board">
                        {this.state.notes.map(this.eachNote)}
                        <button className="btn btn-sm btn-success glyphicon glyphicon-plus"
                                onClick={this.add.bind(null, "New Note")}/>
                </div>

            );
        }
        });
