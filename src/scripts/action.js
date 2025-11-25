// import { getTabs } from "~/scripts/browserActions.ts"

import store from "../store/store"

let browser = require("webextension-polyfill")
// types of action
const Types = {
  UPDATE_ACTIVE_TABS: "UPDATE_ACTIVE_TABS",
  UPDATE_SEARCH_TERM: "UPDATE_SEARCH_TERM",
  TOGGLE_SEARCH_IN: "TOGGLE_SEARCH_IN",
  UPDATE_SELECTED_TABS: "UPDATE_SELECTED_TABS",
  ADD_TO_SELECTED_TABS: "ADD_TO_SELECTED_TABS",
  REMOVE_FROM_SELECTED_TABS: "REMOVE_FROM_SELECTED_TABS"
}
// actions
const updateActiveTabsAction = (tabs) => ({
  type: Types.UPDATE_ACTIVE_TABS,
  payload: tabs
})
const updateSearchTermAction = (searchTerm) => ({
  type: Types.UPDATE_SEARCH_TERM,
  payload: searchTerm
})
const toggleSearchInAction = (searchInArray) => ({
  type: Types.TOGGLE_SEARCH_IN,
  payload: searchInArray
})
const updateSelectedTabsAction = (selectedTabs) => ({
  type: Types.UPDATE_SELECTED_TABS,
  payload: selectedTabs
})
const updateSelectedTabs = (id, selected) => (dispatch) => {
  store().then((store) => {
    const selectedTabs = [...store.getState().selectedTabs]
    !selected
      ? selectedTabs.splice(selectedTabs.indexOf(id), 1)
      : selectedTabs.push(id)
    return dispatch(updateSelectedTabsAction(selectedTabs))
  })
}
// const updateActiveTabs = () => dispatch => {
//   getTabs().then(tabs => {
//     dispatch(updateActiveTabsAction(tabs));
//   });
// };
const reorderTabs = (tabs) => (dispatch) => {
  dispatch(updateActiveTabsAction(tabs))
}
const searchInTabs = (searchTerm) => (dispatch) => {
  dispatch(updateSearchTermAction(searchTerm))
}
const closeTabs =
  (tabIds, promptForClosure = true) =>
    (dispatch) => {
      if (promptForClosure) {
        if (
          !confirm(`Are you sure you want to close the following tab\n` + tabIds)
        )
          return false
      }
      return browser.tabs.remove(tabIds).then(() => {
        return dispatch(updateActiveTabs())
      })
    }
const pinTab = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {pinned: true})
    return dispatch(updateActiveTabs())
  })
}
const unpinTab = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {pinned: false})
    return dispatch(updateActiveTabs())
  })
}
const togglePin = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    !tab.pinned ? dispatch(pinTab(tabId)) : dispatch(unpinTab(tabId))
  })
}
const muteTab = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {muted: true})
    return dispatch(updateActiveTabs())
  })
}
const unmuteTab = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    browser.tabs.update(parseInt(tabId), {muted: false})
    return dispatch(updateActiveTabs())
  })
}
const toggleMute = (tabId) => (dispatch) => {
  return browser.tabs.get(tabId).then((tab) => {
    !tab.mutedInfo.muted ? dispatch(muteTab(tabId)) : dispatch(unmutetab(tabId))
  })
}
export default {
  Types,
  closeTabs,
  pinTab,
  unpinTab,
  togglePin,
  muteTab,
  unmuteTab,
  toggleMute,
  // updateActiveTabs,
  reorderTabs,
  searchInTabs,
  toggleSearchInAction,
  updateSelectedTabs,
  updateSelectedTabsAction
}
