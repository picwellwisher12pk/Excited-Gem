import {
  getTabs,
  setBadge,
  setTabCountInBadge
} from '/src/scripts/browserActions'
import { preferences } from '/src/scripts/defaultPreferences'





function onRemoved(tabId, removeInfo) {
  getTabs().then((tabs) => {
    // window.tabs = tabs;
  })
}

chrome.runtime.onInstalled.addListener(() => {
  let jsonObj = {}
  jsonObj['preferences'] = preferences
  chrome.storage.local.set(jsonObj).then((result) => {
    chrome.storage.local.get('preferences').then((result) => {})
  })
  getTabs('current').then((tabs) => setBadge(tabs.length))
})
chrome.tabs.onRemoved.addListener((tabId) => {
  console.log('Excited Gem: Tab Removed/Closed.')
  onRemoved()
  setTabCountInBadge(tabId, true)
})

chrome.tabs.onDetached.addListener(onRemoved)

chrome.tabs.onCreated.addListener(() => {
  getTabs('current').then((tabs) => setBadge(tabs.length))
})
chrome.tabs.onAttached.addListener(() => {
  getTabs('current').then((tabs) => setBadge(tabs.length))
})

/* Chrome Actions */

chrome.action.onClicked.addListener((tab) => {
  console.info('Extension Page opening')
  chrome.tabs
    .create({ url: chrome.runtime.getURL('/tabs/home.html'), pinned: true })
    .then((tab) => tab)
  // openExcitedGemPage()
})
