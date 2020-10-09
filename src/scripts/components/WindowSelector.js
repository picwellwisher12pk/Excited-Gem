import React from 'react';
import {getTabs} from './browserActions';
import Dropdown from 'react-bootstrap/Dropdown'

var browser = require('webextension-polyfill');

let config = {
  tabsfrom: 'current',
};

function setWindow(window) {
  console.log("setting window")
  config.tabsfrom = window;
  getTabs();
}

export default class WindowSelector extends React.Component {
  state = {
    numberOfWindows: 1,
    browserWindows: [],
    currentWindow: {},
  };

  componentDidMount() {
    browser.windows
      .getAll({
        populate: true,
        windowTypes: ['normal'],
      })
      .then(windowInfoArray => {
        this.setState({numberOfWindows: windowInfoArray.length});
        console.log("window info array", windowInfoArray);
        this.setState({browserWindows: windowInfoArray});
      });
    browser.windows.getCurrent({populate: true}).then(tab => {
      this.setState({currentWindow: tab});
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    browser.windows
      .getAll({
        populate: true,
        windowTypes: ['normal'],
      })
      .then(windowInfoArray => {
        if (prevState.browserWindows.length !== windowInfoArray.length) {
          this.setState({numberOfWindows: windowInfoArray.length});
          this.setState({browserWindows: windowInfoArray});
        }
      });
    browser.windows.getCurrent({populate: true}).then(tab => {
      if (prevState.currentWindow !== tab) this.setState({currentWindow: tab});
    });
  }

  render() {
    if (this.state.numberOfWindows <= 1) return false;
    let currentWindowId = this.state.currentWindow.id;
    let currentWindowTabs = this.state.currentWindow.tabs ? this.state.currentWindow.tabs.length : 0;
    let totalTabCount = this.state.browserWindows.reduce(function (total, window) {
      return total + window.tabs.length;
    }, 0);
    return (
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          Show Tabs From
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setWindow('all')} key={"all"}>
            All Windows
            <span className={`count badge badge-` + (totalTabCount > 50 ? `warning` : `success`)} title="Tab Count">
                  {totalTabCount}
            </span>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setWindow(currentWindowId)} key={"current"}>
            <span className="count badge badge-info" title="Window Id">
                  {currentWindowId}
                </span>
            Current Window
            <span
              className={`count badge badge-` + (currentWindowTabs > 50 ? `warning` : `success`)}
              title="Tab Count"
            >
                  {currentWindowTabs}
                </span>
          </Dropdown.Item>
          {this.state.browserWindows.map(window => {
            return (currentWindowId !== window.id ? <Dropdown.Item onClick={() => setWindow(window.id)} key={window.id}>
              <span className="count badge badge-info" title="Window Id">
                {window.id}
              </span>
              Window
              <span
                className={`count badge badge-` + (window.tabs.length > 50 ? `warning` : `success`)}
                title="Tab Count"
              >
              {window.tabs.length}
              </span>
            </Dropdown.Item> : null);
          })}


        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

WindowSelector.propTypes = {
  // url: PropTypes.string,
};
