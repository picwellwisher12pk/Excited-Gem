import React from 'react';
import {FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome';
import {faVolume} from '@fortawesome/pro-solid-svg-icons/faVolume';
import {faVolumeOff} from '@fortawesome/pro-light-svg-icons/faVolumeOff';
import {faVolumeSlash} from '@fortawesome/pro-solid-svg-icons/faVolumeSlash';
import {faTimes} from '@fortawesome/pro-light-svg-icons/faTimes';
import {faThumbtack} from '@fortawesome/pro-light-svg-icons/faThumbtack';
import {faThumbtack as fasThumbtack} from '@fortawesome/pro-solid-svg-icons/faThumbtack';
import {Draggable} from 'react-beautiful-dnd';
import {connect} from 'react-redux';
import ACTIONS from '../../../../modules/action';

let browser = require('webextension-polyfill');
const Tab = (props) => {
  let {title, url, checked, pinned, discarded} = props;
  //Search Highlighting;
  if (props.searchTerm) {
    const {searchTerm} = props;
    let regex;
    try {
      regex = new RegExp(searchTerm, 'gi');
    } catch (e) {
      console.error("Bad Regular Expressions:", e, searchTerm);
    }
    title = props.title.replace(regex, `<mark>${searchTerm}</mark>`);
    url = props.url.replace(regex, `<mark>${searchTerm}</mark>`);
  }

  let loading = props.status === 'loading', audible = props.audible || props.muted,
    actionButtons = null, audioIcon = '';
  if (!audible) audioIcon = <FA icon={faVolumeOff} className={'text-info'} fixedWidth/>;
  if (audible && !props.muted) audioIcon = <FA icon={faVolume} className={'text-info'} fixedWidth/>;
  if (audible && props.mutedInfo.muted)
    audioIcon = <FA icon={faVolumeSlash} className={'text-info'} fixedWidth/>;
  let iconPinned = <FA icon={pinned ? fasThumbtack : faThumbtack} className={'text-primary'} fixedWidth/>;

  //Markup of Action bar for active tabs: Right side buttons
  if (props.activeTab) {
    actionButtons = [
      <li
        key={1}
        title="Un/Pin Tab"
        className={`clickable pin-tab` + (pinned ? ` active` : ` disabled`)}
        onClick={() => props.togglePin(props.id)}
        aria-label="pinned"
      >
        {iconPinned}
      </li>,
      <li
        key={2}
        title="Un/Mute Tab"
        className={`clickable sound-tab` + (audible ? ` active` : ` disabled`)}
        onClick={() => props.toggleMute(props.id)}
      >
        {audioIcon}
      </li>,
      <li
        key={3}
        title="Close Tab"
        className="clickable remove-tab"
        data-id={props.id}
        onClick={() => props.closeTab(props.id)}
        data-command="remove"
      >
        <FA icon={faTimes} className={'text-danger'}/>
      </li>,
    ];
    } else {
      //Non-Active Tabs only get a remove button on action bar for now.
      actionButtons = (
        <li
          title="Remove"
          className="clickable remove-tab"
          data-id={props.id}
          onClick={() => props.removeTab(props.url)}
          data-command="remove"
        >
          <FA icon={faTimes}/>
        </li>
      );
    }
    return (
      <Draggable
        draggableId={props.id + ""}
        key={props.id}
        index={props.index}
        className={`tab-item ` + (checked && ` checked`) + (loading || discarded ? ` idle` : ` `)}
      >
        {provided => (
          <li
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            // id={`draggable-` + props.id}
            key={props.id}
            className={`tab-item ` + (checked && ` checked`) + (loading || discarded ? ` idle` : ` `)}
          >
            <label className="tab-favicon" aria-label="favicon">
              <img src={props.favIconUrl} title={props.favIconUrl && title} alt={props.favIconUrl && title}/>
              <input
                type="checkbox"
                onChange={() => props.updateSelectedTabs(props.id, !props.checked)}
                checked={props.checked}
                className="checkbox"
              />
            </label>
            <a className="clickable tab-title clip" title={url} dangerouslySetInnerHTML={{__html: title}}/>
            <span
              className="tab-url trimmed dimmed clip"
              dangerouslySetInnerHTML={{__html: url}}
              onClick={() => browser.tabs.update(props.id, {active: true})}
            />
            <ul className=" tab-actions" role="group" aria-label="options">
              {actionButtons}
            </ul>
          </li>
        )}
      </Draggable>
    );
}

const mapStateToProps = function (state) {
  return {
    searchTerm: state.preferences.searchTerm,
  };
};
const mapDispatchToProps = dispatch => ({
  searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
  toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
});
export default connect(mapStateToProps, mapDispatchToProps)(Tab);
