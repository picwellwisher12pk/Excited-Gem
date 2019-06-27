import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Draggable } from 'react-beautiful-dnd';
import { log } from '../../../general';
let browser = require('webextension-polyfill');

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = { ...this.props };
    this.isChecked = this.isChecked.bind(this);
  }

  /**
   *  Click on a tab to focus that tab on browser
   *
   * @param {*} id
   * @memberof Tab
   */
  focusTab(id) {
    browser.tabs.update(id, { active: true });
  }
  isChecked(event) {
    const value = event.target.checked;
    this.props.updateSelectedTabs(this.props.id, value);
  }

  componentWillReceiveProps(props) {
    this.setState({ url: props.url });
    this.setState({ title: props.title });
    this.setState({ favicon: props.favIconUrl });

    //Tabs are either ActiveTabs that is tabs representing on browser
    // Or Links/Tabs on session stored

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
    let { title, url, checked, pinned, discarded } = this.props;
    if (window.searchTerm) {
      let regex = new RegExp(window.searchTerm, 'gi');
      title = this.props.title.replace(regex, `<mark>${window.searchTerm}</mark>`);
      url = this.props.url.replace(regex, `<mark>${window.searchTerm}</mark>`);
      log('title url postprocess', title, url);
    }
    let loading = this.state.status == 'loading';
    let audible = this.props.audible || this.props.muted;
    let linkProps = null;
    let actionButtons = null;
    let audioIcon = '';
    if (!audible) {
      audioIcon = `fal fa-volume`;
    }
    if (audible && !this.props.muted) {
      audioIcon = `fas fa-volume`;
    }
    if (audible && this.props.muted) {
      audioIcon = `fas fa-volume-slash`;
    }

    if (this.props.activeTab) {
      linkProps = { onClick: this.focusTab.bind(null, this.props.id) };
      actionButtons = [
        <li
          key={1}
          title="Un/Pin Tab"
          className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
          onClick={() => this.props.togglePin(this.props.id)}
          aria-label="pinned"
        >
          <i
            className={`fa-fw ` + (pinned ? `fas fa-map-marker` : `fal fa-map-marker-slash`)}
            style={{ width: '30px' }}
          />
        </li>,
        <li
          key={2}
          title="Un/Mute Tab"
          className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
          onClick={() => this.props.toggleMute(this.props.id)}
        >
          <i className={audioIcon} style={{ width: '30px', textAlign: 'center' }} />
        </li>,
        <li
          key={3}
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

    return (
      <Draggable
        draggableId={this.props.id}
        key={this.props.index}
        data-id={this.props.id}
        id={this.props.id}
        index={this.props.index}
        className={`tab-item` + (checked ? ` checked` : ` `) + (loading || discarded ? ` idle` : ` `)}
      >
        {(provided, snapshot) => (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            id={`draggable-` + this.props.index}
            // draggableId={this.props.id}
            key={this.props.index}
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
            <a className="clickable" title={url} {...linkProps} dangerouslySetInnerHTML={{ __html: title }} />
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
        )}
      </Draggable>
    );
  }
}

Tab.propTypes = {
  url: PropTypes.string,
  title: PropTypes.string,
  pinned: PropTypes.bool,
  index: PropTypes.number,
  favicon: PropTypes.string,
  audible: PropTypes.bool,
  status: PropTypes.string,
  checked: PropTypes.bool,
};
export default Tab;
