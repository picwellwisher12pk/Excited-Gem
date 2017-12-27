import $ from "jquery";
import React from "react";
import ReactDOM from "react-dom";
import {timeConverter} from "../components/general.js";
import  Tab from "./tab-unit.rc.jsx";
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
    return <div key={data.created} data-id={data.created} className="panel panel-default">
        <div className="panel-heading clearfix cf" role="tab">
            <h4 className="panel-title ">
              <a role="button" data-toggle="collapse" data-parent="#accordion" href={`#`+ (data.created)} aria-expanded="true" aria-controls={data.created}>
                {/* {timeConverter(created_at)} */}
                {timeConverter(_this.state.data.created)}
              </a>
            </h4>
        </div>
        <div id={data.created} className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
          <div className="panel-body">
            {data.windows.map(function(value, index) {
              return <SessionsTabs data={value} key={index} />;
            })}
          </div>
        </div>
      </div>;
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
          return <Tab key={value.id} id={value.id} favIconUrl={value.favIconUrl} url={value.url} title={value.title} />

        })}
      </ul>

    )
  }
}
