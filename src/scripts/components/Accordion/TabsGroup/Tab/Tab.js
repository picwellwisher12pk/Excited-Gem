import React, { PureComponent } from 'react';
import { FontAwesomeIcon as FA } from '@fortawesome/react-fontawesome';
import { faVolume } from '@fortawesome/pro-solid-svg-icons/faVolume';
import { faVolumeOff } from '@fortawesome/pro-light-svg-icons/faVolumeOff';
import { faVolumeSlash } from '@fortawesome/pro-solid-svg-icons/faVolumeSlash';
import { faTimes } from '@fortawesome/pro-light-svg-icons/faTimes';
import { faThumbtack } from '@fortawesome/pro-light-svg-icons/faThumbtack';
import { faThumbtack as fasThumbtack } from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import { Draggable } from 'react-beautiful-dnd';
import { log } from '../../../general';
import { connect } from 'react-redux';
import ACTIONS from '../../../../modules/action';

let browser = require('webextension-polyfill');

class Tab extends PureComponent {
  componentWillReceiveProps(props) {
    this.setState({ url: props.url, title: props.title, favicon: props.favIconUrl });

    //Tabs are either ActiveTabs that is tabs representing on browser
    // Or Links/Tabs on session stored

    if (props.activeTab) {
      this.setState({ id: props.id });
      if (props.key) this.setState({ key: props.key });
      this.setState({
        indexkey: props.indexkey,
        discarded: props.discarded,
        pinned: props.pinned,
        position: props.position,
        audible: props.audible,
        muted: props.muted,
        checked: props.checked,
        status: props.status,
      });
    }
  }
  render() {
    let { title, url, checked, pinned, discarded } = this.props;
    if (this.props.searchTerm) {
      let regex = new RegExp(this.props.searchTerm, 'gi');
      title = this.props.title.replace(regex, `<mark>${this.props.searchTerm}</mark>`);
      url = this.props.url.replace(regex, `<mark>${this.props.searchTerm}</mark>`);
    }
    let loading = this.props.status === 'loading';
    let audible = this.props.audible || this.props.muted;
    let linkProps = null;
    let actionButtons = null;
    let audioIcon = '';
    if (!audible) audioIcon = <FA icon={faVolumeOff} className={'text-info'} fixedWidth />;
    if (audible && !this.props.muted) audioIcon = <FA icon={faVolume} className={'text-info'} fixedWidth />;
    if (audible && this.props.mutedInfo.muted)
      audioIcon = <FA icon={faVolumeSlash} className={'text-info'} fixedWidth />;
    let iconPinned = <FA icon={pinned ? fasThumbtack : faThumbtack} className={'text-primary'} fixedWidth />;
    if (this.props.activeTab) {
      linkProps = { onClick: () => browser.tabs.update(this.props.id, { active: true }) };
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
          <FA icon={faTimes} className={'text-danger'} />
        </li>,
      ];
    } else {
      actionButtons = (
        <li
          title="Remove"
          className="clickable remove-tab"
          data-id={this.props.id}
          onClick={() => this.props.removeTab(this.props.url)}
          data-command="remove"
        >
          <FA icon={faTimes} />
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
        className={`tab-item ` + (checked && ` checked`) + (loading || discarded ? ` idle` : ` `)}
      >
        {provided => (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            id={`draggable-` + this.props.index}
            // draggableId={this.props.id}
            key={this.props.index}
            className={`tab-item ` + (checked && ` checked`) + (loading || discarded ? ` idle` : ` `)}
          >
            <label className="tab-favicon" aria-label="favicon">
              <img src={this.props.favIconUrl} />
              <input
                type="checkbox"
                onChange={() => this.props.updateSelectedTabs(this.props.id, !this.props.checked)}
                checked={this.props.checked}
                className="checkbox"
              />
            </label>
            <a className="clickable tab-title clip" title={url} dangerouslySetInnerHTML={{ __html: title }} />
            <span
              className="tab-url trimmed dimmed clip"
              dangerouslySetInnerHTML={{ __html: url }}
              onClick={() => browser.tabs.update(this.props.id, { active: true })}
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
const mapStateToProps = function(state) {
  return {
    searchTerm: state.preferences.searchTerm,
  };
};
const mapDispatchToProps = dispatch => ({
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Tab);
