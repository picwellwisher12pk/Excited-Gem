import {getTabs} from '../components/browserActions';
// types of action
const Types = {
  UPDATE_ACTIVE_TABS: 'UPDATE_ACTIVE_TABS',
  UPDATE_SEARCH_TERM: 'UPDATE_SEARCH_TERM',
  TOGGLE_SEARCH_IN: 'TOGGLE_SEARCH_IN',
};
// actions
const updateActiveTabsAction = tabs => ({
  type: Types.UPDATE_ACTIVE_TABS,
  payload: tabs,
});
const updateSearchTermAction = searchTerm => ({
  type: Types.UPDATE_SEARCH_TERM,
  payload: searchTerm,
});
const toggleSearchInAction = searchInArray => ({
  type: Types.TOGGLE_SEARCH_IN,
  payload: searchInArray
});
const updateActiveTabs = () => dispatch => {
  getTabs().then(tabs => {
    dispatch(updateActiveTabsAction(tabs));
  });
};
const reorderTabs = tabs => dispatch => {
  dispatch(updateActiveTabsAction(tabs));
};
const searchInTabs = searchTerm => dispatch => {
  dispatch(updateSearchTermAction(searchTerm));
};
export default {
  Types,
  updateActiveTabs,
  reorderTabs,
  searchInTabs,
  toggleSearchInAction
};
