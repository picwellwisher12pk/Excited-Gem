import {getTabs} from './components/browserActions';

let browser = require('webextension-polyfill');
// types of action
const Types = {
  UPDATE_ACTIVE_TABS: 'UPDATE_ACTIVE_TABS',
  UPDATE_SEARCH_TERM: 'UPDATE_SEARCH_TERM',
  TOGGLE_SEARCH_IN: 'TOGGLE_SEARCH_IN',
  UPDATE_SELECTED_TABS: 'UPDATE_SELECTED_TABS'
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
const updateSelectedTabsAction = selectedTabs => ({
  type: Types.UPDATE_SELECTED_TABS,
  payload: selectedTabs
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
const closeTabs = (tabIds, promptForClosure = true) => dispatch => {
  if (promptForClosure) {
    if (!confirm(`Are you sure you want to close the following tab\n` + tabIds)) return false;
  }
  return browser.tabs.remove(tabIds).then(() => {
    return dispatch(updateActiveTabs());
  })
}
const togglePin = tabId => dispatch => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {pinned: !tab.pinned});
    return dispatch(updateActiveTabs());
  });
}
const toggleMute = tabId => dispatch => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {muted: !tab.mutedInfo.muted});
    return dispatch(updateActiveTabs());
  });
}
export default {
  Types,
  closeTabs,
  togglePin,
  toggleMute,
  updateActiveTabs,
  reorderTabs,
  searchInTabs,
  toggleSearchInAction,
  updateSelectedTabsAction
};
