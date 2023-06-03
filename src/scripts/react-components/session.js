import React from "react"

import Tab from "~/scripts/components/TabsGroup/Tab/"

import {
  removeSessions,
  removeTab,
  renameSession
} from "../components/getsetSessions"
import { timeConverter } from "../general"





var browser = require("webextension-polyfill")
// import { Scrollbars } from 'react-custom-scrollbars';
// let browser = require('webextension-polyfill');
export default class Sessions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data
    }
    this.updateSessions = this.updateSessions.bind(this)
  }

  updateSessions(data) {
    this.setState({ data })
  }

  handleClick() {
    console.log(this) // null
  }

  render() {
    let _this = this
    let sessions = this.state.data
    if (sessions.length === 0) return "No Session Saved."
    return (
      <div
        className="accordion"
        id="accordion"
        role="tablist"
        aria-multiselectable="true">
        {sessions.map(function (value, index) {
          return (
            <Session
              key={index}
              data={value}
              updateSessions={_this.updateSessions}
            />
          )
        })}
      </div>
    )
  }
}
Sessions.propTypes = {
  // data: React.PropTypes.array.isRequired,
}
Sessions.defaultProps = {
  data: []
}

class Session extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      id: this.props.created,
      name: this.props.data.name,
      show: false
    }
  }

  updateSessions(data) {
    this.props.updateSessions(data)
  }

  restoreSession(data, removeSession, sessionID) {
    Object.keys(data.windows).forEach((keyWindow) => {
      browser.windows
        .create({
          url: [...data.windows[keyWindow].map((tab) => tab.url)]
        })
        .then(
          (windowInfo) => {
            if (removeSession) {
              console.log(`Created new tab: ${windowInfo.id}`)
              removeSessions(sessionID).then((items) =>
                this.props.updateSessions(items)
              )
            }
          },
          (error) => console.error(`Error: ${error}`)
        )
    })
  }

  render() {
    let _this = this
    let data = _this.props.data
    let dateTime = timeConverter(this.props.data.created)
    let nameSpan = this.props.data.name ? (
      <span className="session-name">{this.props.data.name}</span>
    ) : (
      ""
    )
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
              onClick={() => _this.setState({ show: !_this.state.show })}>
              {nameSpan}
              <span className="session-datetime">{dateTime}</span>
            </button>
            <span className="pull-right">
              {Object.keys(data.windows).map(function (key, index) {
                return (
                  <small
                    title="Tab count for window"
                    className="session-tab-count badge badge-success"
                    key={index}>
                    {data.windows[key].length}
                  </small>
                )
              })}
            </span>
          </h5>
          <div className="float-right">
            <button
              className="btn btn-sm btn-link"
              title="Restore Tabs and witout deleting"
              onClick={() => this.restoreSession(data)}>
              <i className="fal fa-external-link-square" />
            </button>
            <button
              className="btn btn-sm btn-link"
              title="Restore Tabs and remove them"
              onClick={() => {
                this.restoreSession(data, true, data.created).then((items) =>
                  this.props.updateSessions(items)
                )
              }}>
              <i className="fal fa-external-link" />
            </button>
            <button
              className="btn btn-sm btn-link"
              title="Rename/Retitle Session "
              onClick={() => {
                let sessionName = prompt("Please enter name for your session")
                renameSession(data.created, sessionName).then((items) =>
                  this.props.updateSessions(items)
                )
              }}>
              <i className="fal fa-pen" />
            </button>
            <button
              className="btn btn-sm btn-link text-danger"
              title="Remove Session"
              onClick={() => {
                removeSessions(data.created).then((items) =>
                  this.props.updateSessions(items)
                )
              }}>
              <i className="fal fa-times" />
            </button>
          </div>
        </div>
        <div
          id={data.created}
          className={`collapse` + (_this.state.show ? `show` : ``)}
          data-parent="#accordion"
          aria-labelledby={data.created}
          // id={`collapse` + dateTime}
        >
          {Object.keys(data.windows).map((key, index) => (
            <SessionsTabs
              data={data.windows[key]}
              key={index}
              windowID={key}
              sessionID={data.created}
              updateSessions={_this.updateSessions}
            />
          ))}
        </div>
      </div>
    )
  }
}

class SessionsTabs extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: this.props.data,
      windowID: this.props.windowID,
      sessionID: this.props.sessionID
    }
    this.removeTab = this.removeTab.bind(this)
  }

  removeTab(tabURL) {
    removeTab(tabURL, this.props.windowID, this.props.sessionID).then((items) =>
      window.sessions.updateSessions(items)
    )
  }

  render() {
    let _this = this
    let data = _this.props.data

    return (
      <ul className="list-group list-group-flush" id={_this.props.windowID}>
        {data.map(function (value) {
          return (
            <Tab
              key={value.index}
              id={value.id}
              favIconUrl={value.favIconUrl}
              url={value.url}
              removeTab={_this.removeTab}
              title={value.title}
            />
          )
        })}
      </ul>
    )
  }
}
