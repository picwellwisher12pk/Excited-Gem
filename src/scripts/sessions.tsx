function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  return time;
}
class Sessions extends React.Component {
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
        let sessions = this.state.data;
        // console.log("sessions.js",sessions);
        return (<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                {sessions.map(function(value,index) {
                   return <Session key={index} data ={value} />
                })}

            </div>
            );
  }
}
Sessions.propTypes = {
 data: React.PropTypes.array.isRequired
};
Sessions.defaultProps= {
        data: []
};
class Session extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
        data: this.props.data
    }; 
 }

    render(){   
        let _this = this;
        let data = _this.state.data;
        console.log("session.js Sessions object",data);
        return (

             <div className="panel panel-default">
                        <div className="panel-heading" role="tab" id="headingOne">
                        <h4 className="panel-title">
                            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                            {timeConverter(data.created)}
                            </a>
                        </h4>
                        </div>
                        <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                        <div className="panel-body">
                            { data.windows.map(function(value,index) {
                                    return <SessionsTabs data ={value} key={index}/>
                                    }
                                )
                            }

                        </div>
                        </div>
                    </div>
           
            )       
    }
}
class SessionsTabs extends React.Component{
   constructor(props) {
    super(props);
    this.state = {
        data: this.props.data
    }; 
 }

    render(){   
        let _this = this;
        let data = _this.state.data;
        console.log("session tabs",data);
        return (
             <ul className="list-group"> 
                  {data.map(function(value,index) {
                    console.log(value);
                    return <li className="list-group-item horizontal-block" key={index} id={value.id}>
                        <div className="btn btn-default favicon" role="group" aria-label="favicon">
                        <img src={value.favIconUrl}/>
                    </div>
                        <a href={value.url} className="btn btn-default">
                        {value.title}</a>
                        </li>
                  })}
             </ul>
           
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
