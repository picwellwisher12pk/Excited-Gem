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
        
        return (<ul className="tabs-list list-group">
                {activeTabs.map(function(value) {
                    // console.log("rendering li",value.title);
                    return <Tab key={value.id} id={value.id} pinned={value.pinned} audible={value.audible} position={value.index} url={value.url} title={value.title} favIconUrl={value.favIconUrl} status={value.status}/>
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
        status: this.props.status
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
    render(){
        
        
        let _this = this;
        return (
            <li key={_this.props.id} data-id={_this.props.id} className="list-group-item">
                <span className = {`clickable glyphicon glyphicon-pushpin pinned`+(_this.state.pinned ? ` `: ` disabled`)} onClick={_this.pinTab.bind(_this,_this.props.id,_this.state.pinned)} aria-hidden='true'></span>
                <span className = {`clickable glyphicon glyphicon-volume-off audible`+(_this.state.audible ? ` `: ` disabled`)} onClick={_this.muteTab.bind(_this,_this.props.id,_this.state.audible)} aria-hidden='true'></span>
                <img src={_this.state.favicon}/>
                <strong className="clickable" title={_this.state.title} onClick={_this.focusTab.bind(null,_this.props.id)}>{_this.state.title}</strong>
                <span>{_this.state.url}</span>
                <div className="options pull-right">
                    <span data-id={_this.props.id} onClick={_this.closeTab.bind(null,_this.props.id,_this.state.title)} data-command='remove' className='clickable remove-tab glyphicon glyphicon-remove' aria-hidden='true'></span>
                </div>
           </li>
            )
        
    }
}


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
