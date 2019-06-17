import { getTabs } from '../components/browserActions';
// types of action
const Types = {
  UPDATE_ACTIVE_TABS: 'UPDATE_ACTIVE_TABS',
};
// actions
const updateActiveTabsAction = tabs => ({
  type: Types.UPDATE_ACTIVE_TABS,
  payload: tabs,
});
const updateActiveTabs = eventName => dispatch => {
  console.log('Event name:', eventName);
  getTabs().then(tabs => {
    dispatch(updateActiveTabsAction(tabs));
  });
};
const reorderTabs = tabs => dispatch => {
  dispatch(updateActiveTabsAction(tabs));
};
export default {
  Types,
  updateActiveTabs,
  reorderTabs,
};
