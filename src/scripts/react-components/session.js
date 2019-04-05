import React from 'react';
import { timeConverter } from '../components/general';
import Tab from '../components/Accordion/Tabsgroup/Tab/';
import { renameSession, removeSessions, getSessions } from '../components/getsetSessions';
// import { Scrollbars } from 'react-custom-scrollbars';
// let browser = require('webextension-polyfill');
export default class Sessions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
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
    console.log(('Sessions': sessions));
    console.log(this.props.data, this.state.data);
    if (sessions == []) return 'No Session Saved.';
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
      id: this.props.created,
      name: this.props.data.name,
      show: false,
    };
  }

  componentDidMount() {}
  // showToggle(){

  // }

  render() {
    let _this = this;
    let data = _this.props.data;
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
              {this.props.data.name ? this.props.data.name : dateTime}
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
            <button
              className="btn btn-sm btn-link"
              title="Rename/Retitle Session "
              onClick={() => {
                let sessionName = prompt('Please enter name for your session');
                renameSession(data.created, sessionName).then(items => this.props.updateSessions(items));
              }}
            >
              <i className="fal fa-pen" />
            </button>
            <button
              className="btn btn-sm btn-link text-danger"
              title="Remove Session"
              onClick={() => {
                // console.log(removeSessions(data.created).then(item => item));
                removeSessions(data.created).then(items => this.props.updateSessions(items));
              }}
            >
              <i className="fal fa-times" />
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
