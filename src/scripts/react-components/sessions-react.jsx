import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";

// 
import packagedAndBroadcast from "../components/communications.js";
export default class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      name: this.props.data.name,
      id: this.props.data.created
    }
  }

  handleClick() {
    console.log(this); // null
  }

  render() {
    let _this = this;
    let sessions = this.state.data;
    console.log("sessions.js", sessions);
    return (<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
      {sessions.map(function (value, index) {
        return <Session key={index} data={value} />
      })}

    </div>
    );
  }
}
Sessions.propTypes = {
  data: React.PropTypes.array.isRequired
};
Sessions.defaultProps = {
  data: []
};
class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }
  exposeSessionNameInput() {
    $(".eg .sessions .panel-group .panel-heading input.form-control").removeAttr('readOnly').toggleClass("col-sm-10").focus();
    $(".eg .sessions .panel-group .panel-heading .session-name button.btn-success.save").show('fast').toggleClass("col-sm-2");
    $(".eg .sessions .panel-group .panel-heading .session-name button.btn-primary").hide();
  }
  renameSession(id) {
    this.setState({ name: event.target.value });

  }
  render() {
    let _this = this;
    let data = _this.state.data;
    let created_at = data.created_at;
    console.log("session.js Sessions object", timeConverter(created_at));
    return (
      <div className="panel panel-default">
        <div className="panel-heading clearfix cf" role="tab" id="headingOne">
          <div className="row">
            <div className="col-sm-4 session-name">
              <input type="text" className="form-control" placeholder="Enter session name" value={this.state.name} readOnly />
              <button className="btn btn-success save" onClick={this.renameSession.bind(_this, _this.state.created)} > Save </button>
              <button className="btn btn-primary" title="Edit session name">
                <span className="glyphicon glyphicon-pencil" onClick={this.exposeSessionNameInput.bind(this)}></span>
              </button>
            </div>
            <h4 className="panel-title pull-left col-sm-4">
              <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">

                {timeConverter(created_at)}
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
            {data.windows.map(function (value, index) {
              return <SessionsTabs data={value} key={index} />
            }
            )
            }

          </div>
        </div>
      </div>

    )
  }
}

class SessionsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  render() {
    let _this = this;
    let data = _this.state.data;
    console.log("session tabs", data);
    return (
      <ul className="list-group">
        {data.map(function (value, index) {
          console.log(value);
          return <li className="list-group-item horizontal-block" key={index} id={value.id}>
            <div className="btn btn-default favicon" role="group" aria-label="favicon">
              <img src={value.favIconUrl} />
            </div>
            <a href={value.url} className="btn btn-default">
              {value.title}</a>
          </li>
        })}
      </ul>

    )
  }
}