import React, {PureComponent} from 'react';
import {FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome';
import {faVolume} from '@fortawesome/pro-solid-svg-icons/faVolume';
import {faVolumeOff} from '@fortawesome/pro-light-svg-icons/faVolumeOff';
import {faVolumeSlash} from '@fortawesome/pro-solid-svg-icons/faVolumeSlash';
import {faTimes} from '@fortawesome/pro-light-svg-icons/faTimes';
import {faThumbtack} from '@fortawesome/pro-light-svg-icons/faThumbtack';
import {faThumbtack as fasThumbtack} from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import {Draggable} from 'react-beautiful-dnd';
import {log} from '../../../general';
import {connect} from 'react-redux';
import ACTIONS from '../../../../modules/action';

let browser = require('webextension-polyfill');

/**
 *  Click on a tab to focus that tab on browser
 *  Browser Action
 *
 * @param {*} id
 * @memberof Tab
 */
function focusTab(id) {
  browser.tabs.update(id, {active: true});
}
class Tab extends PureComponent {
  constructor(props) {
    super(props);
    // this.state = { ...this.props };
    this.isChecked = this.isChecked.bind(this);
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
    let loading = this.props.status === 'loading';
    let audible = this.props.audible || this.props.muted;
    let linkProps = null;
    let actionButtons = null;
    let audioIcon = '';
    if (!audible) {
      // audioIcon = <img src={'icons/volume-off.svg'} style={{ width: '30px' }} />;
      audioIcon = <FA icon={faVolumeOff} className={'text-info'} fixedWidth/>;
    }
    if (audible && !this.props.muted) {
      audioIcon = <FA icon={faVolume} className={'text-info'} fixedWidth/>;
    }
    console.log("muted?:", audible, this.props.mutedInfo.muted);
    if (audible && this.props.mutedInfo.muted) {
      audioIcon = <FA icon={faVolumeSlash} className={'text-info'} fixedWidth/>;
    }
    let iconPinned = pinned ?
      <FA icon={fasThumbtack} className={'text-primary'} fixedWidth/> :
      <FA icon={faThumbtack} className={'text-primary'} fixedWidth/>;
    if (this.props.activeTab) {
      linkProps = {onClick: focusTab.bind(null, this.props.id)};
      actionButtons = [
        <li
          key={1}
          title="Un/Pin Tab"
          className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
          onClick={() => this.props.togglePin(this.props.id)}
          aria-label="pinned"
        >
          {iconPinned}
        </li>,
        <li
          key={2}
          title="Un/Mute Tab"
          className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
          onClick={() => this.props.toggleMute(this.props.id)}
        >
          {audioIcon}
        </li>,
        <li
          key={3}
          title="Close Tab"
          className="clickable remove-tab"
          data-id={this.props.id}
          onClick={() => this.props.closeTab(this.props.id)}
          data-command="remove"
        >
          <FA icon={faTimes} className={'text-danger'}/>
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
          <FA icon={faTimes}/>
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
        {(provided) => (
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
              <img src={this.props.favicon}/>
              <input
                type="checkbox"
                onChange={this.isChecked.bind(this)}
                checked={this.props.checked}
                className="checkbox"
              />
            </label>
            <a className="clickable" title={url} {...linkProps} dangerouslySetInnerHTML={{ __html: title }} />
            <span
              className="tab-url trimmed dimmed clip"
              dangerouslySetInnerHTML={{ __html: url }}
              onClick={() => {
                focusTab(this.props.id)
              }}
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

const mapDispatchToProps = dispatch => ({
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray)),

});
export default connect(null, mapDispatchToProps)(Tab);
