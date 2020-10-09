import React from 'react';
import {FontAwesomeIcon as FA} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {faThumbtack, faThumbtack as fasThumbtack} from '@fortawesome/free-solid-svg-icons/faThumbtack';
import {Draggable} from 'react-beautiful-dnd';
// import {useSelector, useDispatch} from 'react-redux';
// import ACTIONS from '../../../../modules/action';
import VolumeIcon from "../../../VolumeIcon";

let browser = require('webextension-polyfill');

export default function Tab(props) {
  // const state = useSelector(state => state);
  // const dispatch = useDispatch();

  let {title, url, checked, discarded} = props;
  //Search Highlighting;
  if (props.searchTerm) {
    const {searchTerm} = props;
    let regex;
    try {
      regex = new RegExp(searchTerm, 'gi');
    } catch (e) {
      console.log("Bad Regular Expressions:", e, searchTerm);
    }
    title = props.title.replace(regex, `<mark>${searchTerm}</mark>`);
    url = props.url.replace(regex, `<mark>${searchTerm}</mark>`);
  }

  let {loading, pinned} = props;
  let actionButtons = null;
  let isLoading = loading;
  let iconPinned = <FA icon={pinned ? fasThumbtack : faThumbtack} className={'text-primary'} fixedWidth/>;

  //Markup of Action bar for active tabs: Right side buttons
  if (props.activeTab) {
    actionButtons = [
      <li
        key={1}
        title="Un/Pin Tab"
        className={`clickable pin-tab ${pinned ? ' active' : ' disabled'}`}
        onClick={() => props.togglePin(props.id)}
        aria-label="pinned"
      >
        {iconPinned}
      </li>,
      VolumeIcon(props),
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
        onClick={props.removeTab(props.url)}
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
      className={`tab-item ` + (checked && ` checked`) + (isLoading || discarded ? ` idle` : ` `)}
    >
      {provided => (
        <li
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          // id={`draggable-` + props.id}
          key={props.id}
          className={`tab-item ${checked && ' checked'} ${(isLoading || discarded) && ' idle'}`}
        >
          <label className="tab-favicon" aria-label="favicon">
            {props.favIconUrl ? <img src={props.favIconUrl} alt={title}/> : <span className={'favicon'}/>}
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
            onClick={() => browser?.tabs?.update(props.id, {active: true})}
          />
          <ul className=" tab-actions" role="group" aria-label="options">
            {actionButtons}
          </ul>
        </li>
      )}
    </Draggable>
  );

}
// const mapStateToProps = function(state) {
//   return {
//     searchTerm: state.preferences.searchTerm,
//   };
// };
// const mapDispatchToProps = dispatch => ({
//   searchInTabs: searchTerm => dispatch(ACTIONS.searchInTabs(searchTerm)),
//   toggleSearchInAction: searchInArray => dispatch(ACTIONS.toggleSearchInAction(searchInArray)),
// });
// export default connect(mapStateToProps, mapDispatchToProps)(Tab);
