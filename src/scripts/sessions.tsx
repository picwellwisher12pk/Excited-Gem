let one_session;
function timeConverter(UNIX_timestamp){
  // var a = new Date(UNIX_timestamp * 1000);
  // var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  // var year = a.getFullYear();
  // var month = months[a.getMonth()];
  // var date = a.getDate();
  // var hour = a.getHours();
  // var min = a.getMinutes();
  // var sec = a.getSeconds();
  // var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
  var date = new Date(UNIX_timestamp);
  return date;
}
class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        data: this.props.data,
        name: this.props.data.name,
        id: this.props.data.created,
        created: this.props.data.created
    };
   }

    handleClick() {
        console.log(this); // null
    }
    
    render() {
        let _this = this;
        let current_window_sessions = this.state.data;
        console.log("sessions.js All Sessions",current_window_sessions);
        return (<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                {current_window_sessions.map(function(value,index) {
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
  exposeSessionNameInput(){
    $(".eg .sessions .panel-group .panel-heading input.form-control").removeAttr('readOnly').toggleClass("col-sm-10").focus();
    $(".eg .sessions .panel-group .panel-heading .session-name button.btn-success.save").show('fast').toggleClass("col-sm-2");
    $(".eg .sessions .panel-group .panel-heading .session-name button.btn-primary").hide();
  }
  renameSession(id){
    this.setState({ name : event.target.value});

  }
  render(){   
      let _this = this;
      one_session = _this.state.data;
      var cts = one_session.created_at;
      cdate = (new Date(cts)).toString();
      console.log("date",cdate);
      return (

           <div className="panel panel-default">
                      <div className="panel-heading clearfix cf" role="tab" id="headingOne">
                          <div className="row">
                              <div className="col-sm-4 session-name">
                                  {/* <input type="text" className="form-control" placeholder="Enter session name" value={this.state.name} readOnly />
                                  <button className="btn btn-success save" onClick={this.renameSession.bind(_this,_this.state.created} > Save </button>
                                  <button className="btn btn-primary" title="Edit session name"><span className="glyphicon glyphicon-pencil" onClick={this.exposeSessionNameInput.bind(this)}></span></button> */}
                              </div>
                              <h4 className="panel-title pull-left col-sm-4">
                                  <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                  {cdate}
                                  </a>
                              </h4>
                              <div className="col-sm-4">
                                  <button type="button" className="btn btn-danger btn-sm pull-right">
                                      <span className="glyphicon glyphicon-remove"></span>
                                  </button>
                              </div>
                          </div>
                      </div>
                      <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                      <div className="panel-body">
                          { one_session.windows.map(function(value,index) {
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
        let tab = _this.state.data;
        console.log("session tabs",tab);
        return (
             <ul className="list-group"> 
                  {tab.map(function(value,index) {
                    return <li className="ui-widget-content list-group-item horizontal-block" key={index} id={value.id}>
                            <span className="favicon" role="group" aria-label="favicon">
                                <img src={value.favIconUrl}/>
                            </span>
                            <a href={value.url} className="">
                                {value.title}
                            </a>
                            <ul className="nav nav-pills options pull-right btn-group tabs-context-buttons" role="group" aria-label="options">
                                <li title="Close Tab" className=' clickable remove-tab' data-id={_this.props.id}  data-command='remove' aria-hidden='true'>
                                    <svg stroke-linejoin="round" clip-rule="evenodd" fill-rule="evenodd" height="16" width="16" stroke-miterlimit="1.4142"viewBox="0 0 16 17">
                                        <path id="Close-Circle-Icon" d="m8 16.678c-4.418 0-8-3.581-8-8 0-4.418 3.582-8 8-8s8 3.582 8 8c0 4.419-3.582 8-8 8zm2.831-10.843c-0.388-0.388-1.017-0.388-1.405 0l-1.432 1.432-1.433-1.432c-0.388-0.388-1.017-0.388-1.405 0s-0.388 1.017 0 1.405l1.433 1.432-1.433 1.433c-0.388 0.387-0.388 1.017 0 1.405s1.017 0.388 1.405 0l1.433-1.433 1.432 1.433c0.388 0.388 1.017 0.388 1.405 0s0.388-1.018 0-1.405l-1.433-1.433 1.433-1.432c0.388-0.388 0.388-1.017 0-1.405z" />
                                    </svg>
                                </li>
                            </ul>
                        </li>
                  })}
             </ul>
           
            )       
    }
}