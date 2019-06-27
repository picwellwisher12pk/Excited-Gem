import React from 'react';
import PropTypes from 'prop-types';
var browser = require('webextension-polyfill');
import { updateTabs, getTabs, setTabCountInBadge } from './browserActions';
let config = {
  tabsfrom: 'current',
};
export default class WindowSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfWindows: 1,
      browserWindows: [],
      currentWindow: {},
    };
  }
  setWindow(window) {
    config.tabsfrom = window;
    getTabs();
  }
  componentDidMount() {
    browser.windows
      .getAll({
        populate: true,
        windowTypes: ['normal'],
      })
      .then(windowInfoArray => {
        this.setState({ numberOfWindows: windowInfoArray.length });
        this.setState({ browserWindows: windowInfoArray });
      });
    browser.windows.getCurrent({ populate: true }).then(tab => {
      this.setState({ currentWindow: tab });
    });
  }
  render() {
    if (this.state.numberOfWindows <= 1) return false;
    let currentWindowId = this.state.currentWindow.id;
    let currentWindowTabs = this.state.currentWindow.tabs ? this.state.currentWindow.tabs.length : 0;
    let totalTabCount = this.state.browserWindows.reduce(function(total, window) {
      return total + window.tabs.length;
    }, 0);
    return (
      <li role="presentation" className="nav-item dropdown">
        <a
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          title="Show Tabs from Current/All Window(s)"
          className="nav-link dropdown-toggle"
          href="#"
        >
          Show Tabs From
        </a>
        <div className="dropdown-menu" style={{ width: '250px', padding: '0' }}>
          <ul className="list-group">
            <li className="list-group-item">
              <a href="#" className="d-flex justify-content-between align-items-center" onClick={this.setWindow('all')}>
                <span className="count badge badge-info" title="Window Id">
                  None
                </span>
                All Windows
                <span className={`count badge badge-` + (totalTabCount > 50 ? `warning` : `success`)} title="Tab Count">
                  {totalTabCount}
                </span>
              </a>
            </li>
            <li className="list-group-item ">
              <a
                href="#"
                className="d-flex justify-content-between align-items-center"
                onClick={this.setWindow(currentWindowId)}
              >
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
              </a>
            </li>
            {this.state.browserWindows.map(window => (
              <li className="list-group-item" onClick={this.setWindow(window.id)} key={window.id}>
                <a
                  href="#"
                  className="d-flex justify-content-between align-items-center"
                  onClick={this.setWindow(window.id)}
                >
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
                </a>
              </li>
            ))}
          </ul>
        </div>
      </li>
    );
  }
}

WindowSelector.propTypes = {
  // url: PropTypes.string,
};
