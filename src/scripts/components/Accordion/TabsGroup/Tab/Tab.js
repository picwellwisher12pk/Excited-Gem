// let console.log = require('console.log')('tab');
import React from 'react';
import PropTypes from 'prop-types';
import { log } from '../../../general';
let browser = require('webextension-polyfill');

export default class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props };
    this.isChecked = this.isChecked.bind(this);
  }
  focusTab(id) {
    browser.tabs.update(id, { active: true });
  }
  isChecked(event) {
    const value = event.target.checked;
    this.props.updateSelectedTabs(this.props.id, value);
  }
  componentWillReceiveProps(props) {
    // console.log("Tab.js getting new props:",props);
  }
  componentWillUnmount() {
    // console.log("Tab.js unmounting:");
  }
  componentDidUpdate(props, state, snapshot) {
    // console.log("Tab.js updated",props,state);
  }
  componentWillReceiveProps(props) {
    this.setState({ url: props.url });
    this.setState({ title: props.title });
    this.setState({ favicon: props.favIconUrl });
    if (props.activeTab) {
      this.setState({ id: props.id });
      if (props.key) this.setState({ key: props.key });
      this.setState({ indexkey: props.indexkey });
      this.setState({ discarded: props.discarded });
      this.setState({ pinned: props.pinned });
      this.setState({ position: props.position });
      this.setState({ audible: props.audible });
      this.setState({ muted: props.muted });
      this.setState({ checked: props.checked });
      this.setState({ status: props.status });
    }
  }
  render() {
    let title = this.state.title;
    let url = this.state.url;
    if (window.searchTerm) {
      let regex = new RegExp(window.searchTerm, 'gi');
      title = this.state.title.replace(regex, `<mark>${window.searchTerm}</mark>`);
      url = this.state.url.replace(regex, `<mark>${window.searchTerm}</mark>`);
    }
    let linkProps = null;
    let actionButtons = null;
    if (this.props.activeTab) {
      linkProps = { onClick: this.focusTab.bind(null, this.props.id) };
      actionButtons = [
        <li
          title="Un/Pin Tab"
          className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
          onClick={() => this.props.togglePin(this.props.id)}
          aria-label="pinned"
        >
          <i className="far fa-map-marker fw-fw" />
        </li>,
        <li
          title="Un/Mute Tab"
          className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
          onClick={() => this.props.toggleMute(this.props.id)}
        >
          <i className={`fw-fw ` + (!this.state.muted ? `far fa-volume-up` : `far fa-volume-mute`)} />
        </li>,
        <li
          title="Close Tab"
          className="clickable remove-tab"
          data-id={this.props.id}
          onClick={() => this.props.closeTab(this.props.id)}
          data-command="remove"
        >
          <i className="far fa-times fw-fw" />
        </li>,
      ];
    } else {
      linkProps = { href: this.props.url, target: '_blank' };
      actionButtons = (
        <li
          title="Remove"
          className="clickable remove-tab"
          data-id={this.props.id}
          onClick={() => this.props.removeTab(this.props.url)}
          data-command="remove"
        >
          <i className="far fa-times fw-fw" />
        </li>
      );
    }

    let checked = this.state.checked;
    let pinned = this.state.pinned;
    let loading = this.state.status == 'loading';
    let discarded = this.state.discarded;
    let audible = this.state.audible || this.state.muted;
    return (
      <li
        key={this.props.id}
        data-id={this.props.id}
        className={`tab-item` + (checked ? ` checked` : ` `) + (loading || discarded ? ` idle` : ` `)}
      >
        <label className="tab-favicon" aria-label="favicon">
          <img src={this.state.favicon} />
          <input
            type="checkbox"
            onChange={this.isChecked.bind(this)}
            checked={this.state.checked}
            className="checkbox"
          />
        </label>
        <a title={url} {...linkProps} dangerouslySetInnerHTML={{ __html: title }} />
        <span
          className="tab-url trimmed dimmed clip"
          dangerouslySetInnerHTML={{ __html: url }}
          onClick={this.focusTab.bind(null, this.props.id)}
        />
        <ul className=" tab-actions" role="group" aria-label="options">
          {/* <li title="Tab Information" className="clickable">
            onClick={this.infoModal.bind(null, this.state.data)}
          <i className="fa fa-info-circle fw-fw" />
          </li> */}
          {actionButtons}
        </ul>
      </li>
    );
  }
}

Tab.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  pinned: PropTypes.bool,
  position: PropTypes.number,
  favicon: PropTypes.string,
  audible: PropTypes.bool,
  status: PropTypes.string,
  checked: PropTypes.bool,
};
