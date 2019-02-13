import React from 'react';
import { timeConverter } from '../components/general';
import Tab from '../components/Accordion/Tabsgroup/Tab/';
import { removeSessions } from '../components/getsetSessions';
let browser = require('webextension-polyfill');
export default class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      name: this.props.data.name,
      id: this.props.data.created,
    };
    this.updateSessions = this.updateSessions.bind(this);
  }
  updateSessions(data) {
    this.setState({ data });
  }
  handleClick() {
    console.log(this); // null
  }

  render() {
    let _this = this;
    let sessions = this.state.data;
    return (
      <div className="accordion" id="accordion" role="tablist" aria-multiselectable="true">
        {sessions.map(function(value, index) {
          return <Session key={index} data={value} updateSessions={_this.updateSessions} />;
        })}
      </div>
    );
  }
}
Sessions.propTypes = {
  // data: React.PropTypes.array.isRequired,
};
Sessions.defaultProps = {
  data: [],
};
class Session extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      show: false,
    };
  }
  exposeSessionNameInput() {
    $('.eg .sessions .panel-group .panel-heading input.form-control')
      .removeAttr('readOnly')
      .toggleClass('col-sm-10')
      .focus();
    $('.eg .sessions .panel-group .panel-heading .session-name button.btn-success.save')
      .show('fast')
      .toggleClass('col-sm-2');
    $('.eg .sessions .panel-group .panel-heading .session-name button.btn-primary').hide();
  }
  componentDidMount() {}
  // showToggle(){

  // }
  renameSession(id) {
    this.setState({ name: event.target.value });
  }
  render() {
    let _this = this;
    let data = _this.state.data;
    // console.log(this.state.data.created);
    let dateTime = timeConverter(this.state.data.created);
    return (
      <div key={data.created} data-id={data.created} className="card">
        <div className="card-header clearfix cf" id={data.created}>
          <h5 className="mb-0 float-left">
            <button
              className="btn btn-link"
              type="button"
              data-toggle="collapse"
              data-target={`#collapse` + dateTime}
              aria-expanded="true"
              aria-controls={`collapse` + dateTime}
              aria-controls={data.created}
              onClick={() => _this.setState({ show: !_this.state.show })}
            >
              {dateTime}
            </button>
            <span className="pull-right">
              {data.windows.map(function(value, index) {
                return (
                  <small className="badge badge-success" key={index}>
                    {index + 1} : {value.length}
                  </small>
                );
              })}
            </span>
          </h5>
          <div className="float-right">
            <button className="btn btn-sm btn-link">
              <i className="fa fa-pen" />
            </button>
            <button
              className="btn btn-sm btn-link text-danger"
              onClick={() => {
                console.log(removeSessions(data.created).then(item => item));
                removeSessions(data.created).then(items => this.props.updateSessions(items));
              }}
            >
              <i className="fa fa-times" />
            </button>
          </div>
        </div>
        <div
          id={data.created}
          className={`collapse` + (_this.state.show ? `show` : ``)}
          data-parent="#accordion"
          aria-labelledby={data.created}
          id={`collapse` + dateTime}
        >
          <div className="card-body">
            {data.windows.map(function(value, index) {
              return <SessionsTabs data={value} key={index} windowID={index} />;
            })}
          </div>
        </div>
      </div>
    );
  }
}

class SessionsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      windowID: this.props.windowID,
    };
  }

  render() {
    let _this = this;
    let data = _this.state.data;
    // console.log("session tabs", data);
    return (
      <ul className="list-group" id={_this.props.windowID}>
        {data.map(function(value, index) {
          // console.log(value);
          return <Tab key={value.id} id={value.id} favIconUrl={value.favIconUrl} url={value.url} title={value.title} />;
        })}
      </ul>
    );
  }
}
