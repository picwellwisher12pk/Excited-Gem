import {
  getTabs,
  setBadge,
  setTabCountInBadge
} from './scripts/browserActions'
import { preferences } from './scripts/defaultPreferences'





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

async function openInTab(url: string, mode: 'single' | 'per-window', currentWindowId: number) {
  if (mode === 'single') {
    const tabs = await chrome.tabs.query({ url });
    if (tabs.length > 0) {
      const tab = tabs[0];
      if (tab.id) {
        await chrome.tabs.update(tab.id, { active: true });
        await chrome.windows.update(tab.windowId, { focused: true });
      }
      return;
    }
  } else {
    // per-window
    const tabs = await chrome.tabs.query({ url, windowId: currentWindowId });
    if (tabs.length > 0) {
      if (tabs[0].id) {
        await chrome.tabs.update(tabs[0].id, { active: true });
      }
      return;
    }
  }

  // If not found, create
  await chrome.tabs.create({ url, pinned: true });
}

chrome.action.onClicked.addListener(async (tab) => {
  console.info('Extension Page opening');
  const { displayMode = 'sidebar', tabManagementMode = 'single' } = await chrome.storage.local.get(['displayMode', 'tabManagementMode']);
  const extensionUrl = chrome.runtime.getURL('/tabs/home.html');

  if (displayMode === 'sidebar') {
    // @ts-ignore - sidePanel types might be missing
    if (chrome.sidePanel && chrome.sidePanel.open) {
      // @ts-ignore
      await chrome.sidePanel.open({ windowId: tab.windowId });
    } else {
      await openInTab(extensionUrl, tabManagementMode, tab.windowId);
    }
  } else if (displayMode === 'popup') {
    await chrome.windows.create({
      url: extensionUrl,
      type: 'popup',
      width: 450,
      height: 600
    });
  } else {
    await openInTab(extensionUrl, tabManagementMode, tab.windowId);
  }
});
