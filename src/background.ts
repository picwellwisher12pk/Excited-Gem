import {
  getTabs,
  setBadge,
  setTabCountInBadge
} from './scripts/browserActions'
import { preferences } from './scripts/defaultPreferences'

console.log("DEBUG: Background script loaded");

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
chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
  console.log('Excited Gem: Tab Removed/Closed.')
  onRemoved(tabId, removeInfo)
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
  // If openPanelOnActionClick is true (sidebar mode), this listener will NOT fire.
  // If popup is set (popup mode), this listener will NOT fire.
  // So this only fires for 'tab' mode or fallback.
  const { tabManagementMode = 'single' } = await chrome.storage.local.get(['tabManagementMode']);
  const extensionUrl = chrome.runtime.getURL('/tabs/home.html');

  console.log('DEBUG: onClicked fired. Assuming Tab Mode.');
  await openInTab(extensionUrl, tabManagementMode, tab.windowId);
});

// Store YouTube video information by tab ID
const youtubeVideoInfo = new Map<number, any>();

// Restore state from storage on startup
chrome.storage.local.get('youtubeInfoMap').then(({ youtubeInfoMap }) => {
  if (youtubeInfoMap) {
    Object.entries(youtubeInfoMap).forEach(([tabId, info]) => {
      youtubeVideoInfo.set(Number(tabId), info);
    });
    console.log('DEBUG: Restored youtubeVideoInfo from storage:', youtubeVideoInfo);
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // Handle messages from YouTube content script
  if (message.type === "YOUTUBE_VIDEO_INFO" && sender.tab?.id) {
    console.log("DEBUG: Background received YOUTUBE_VIDEO_INFO", message.data);
    const tabId = sender.tab.id;
    message.data.tabId = tabId;
    youtubeVideoInfo.set(tabId, message.data);

    // Store in local storage so UI components can pick it up
    chrome.storage.local.set({ youtubeInfoMap: Object.fromEntries(youtubeVideoInfo) });
  }

  // Handle requests for YouTube info
  if (message.type === "GET_ALL_YOUTUBE_INFO") {
    sendResponse(Array.from(youtubeVideoInfo.entries()));
    return true;
  }
});

// Clean up data when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  if (youtubeVideoInfo.has(tabId)) {
    youtubeVideoInfo.delete(tabId);
    chrome.storage.local.set({ youtubeInfoMap: Object.fromEntries(youtubeVideoInfo) });
  }
});

// Update Action Popup state based on settings
// Update Action Popup and SidePanel behavior based on settings
const updateActionState = async (mode: string) => {
  console.log('DEBUG: Updating action state to:', mode);

  // 1. Configure SidePanel Behavior (if supported)
  // @ts-ignore
  if (chrome.sidePanel && chrome.sidePanel.setPanelBehavior) {
    try {
      // @ts-ignore
      await chrome.sidePanel.setPanelBehavior({
        openPanelOnActionClick: mode === 'sidebar'
      });
      console.log('DEBUG: setPanelBehavior success');
    } catch (e) {
      console.error('DEBUG: setPanelBehavior failed', e);
    }
  }

  // 2. Configure Popup
  if (mode === 'popup') {
    await chrome.action.setPopup({ popup: 'tabs/home.html' });
  } else {
    // For 'sidebar' (native open) or 'tab' (handled by onClicked), remove popup
    await chrome.action.setPopup({ popup: '' });
  }
};

chrome.storage.local.get('displayMode').then(({ displayMode }) => {
  updateActionState(displayMode || 'sidebar');
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.displayMode) {
    updateActionState(changes.displayMode.newValue);
  }
});

// Dynamic Content Script Registration removed as we are using host_permissions and static declaration
