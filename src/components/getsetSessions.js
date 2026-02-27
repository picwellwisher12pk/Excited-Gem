const browser = window.browser || window.chrome

// Helper to get storage
async function getStorage(keys) {
  return new Promise((resolve) => {
    browser.storage.local.get(keys, (result) => resolve(result))
  })
}

// Helper to set storage
async function setStorage(data) {
  return new Promise((resolve) => {
    browser.storage.local.set(data, () => resolve())
  })
}

// Migration function
export async function migrateSessions() {
  const storage = await getStorage(['sessions', 'urlBank', 'sessions_migrated'])
  if (storage.sessions_migrated) return

  console.log('Starting session migration...')
  const oldSessions = storage.sessions || []
  const urlBank = storage.urlBank || []
  const newSessions = []

  for (const session of oldSessions) {
    const newWindows = {}
    if (session.windows) {
      // Handle both array (if any) and object windows
      const windowKeys = Object.keys(session.windows)
      windowKeys.forEach((winId) => {
        const tabs = session.windows[winId]
        if (Array.isArray(tabs)) {
          newWindows[winId] = tabs.map((tab) => {
            let index = urlBank.findIndex((u) => u.url === tab.url)
            if (index === -1) {
              urlBank.push({ url: tab.url, title: tab.title })
              index = urlBank.length - 1
            }
            return index
          })
        }
      })
    }
    newSessions.push({ ...session, windows: newWindows })
  }

  await setStorage({
    sessions: newSessions,
    urlBank,
    sessions_migrated: true
  })
  console.log('Sessions migrated successfully!')
}

// Save a session (generic)
// tabs: Array of { url, title, windowId }
export async function saveSession(tabs, name) {
  await migrateSessions() // Ensure migration before saving new data

  const storage = await getStorage(['urlBank', 'sessions'])
  let urlBank = storage.urlBank || []
  let sessions = storage.sessions || []

  const windowMap = {}

  tabs.forEach((tab) => {
    let index = urlBank.findIndex((u) => u.url === tab.url)
    if (index === -1) {
      urlBank.push({ url: tab.url, title: tab.title })
      index = urlBank.length - 1
    }

    // Default to window 0 if no windowId provided
    const winId = tab.windowId !== undefined ? tab.windowId : 0
    if (!windowMap[winId]) windowMap[winId] = []
    windowMap[winId].push(index)
  })

  const newSession = {
    created: Date.now(),
    modified: null,
    name: name || `Session ${new Date().toLocaleString()}`,
    windows: windowMap
  }

  sessions.push(newSession)

  await setStorage({ urlBank, sessions })

  // Notify user
  if (browser.notifications) {
    browser.notifications.create('session-saved', {
      type: 'basic',
      iconUrl: '../images/extension-icon48.png', // Adjust path if needed
      title: 'Session Saved',
      message: `Session "${newSession.name}" has been saved.`
    })
  }

  return newSession
}

// Legacy support: saveTabs (saves selected tabs to a session)
export async function saveTabs(tabs) {
  // tabs might be just {url, title}
  return saveSession(tabs, '')
}

// Legacy support: saveSessions (saves all open windows)
export async function saveSessions() {
  // Get all windows and tabs
  // We need to use browser.windows.getAll
  // This function might need to be called from a context where browser.windows is available (background or popup)

  // If we are in a content script, this won't work. But this file seems to be used in popup/options.

  // We'll assume we can call browser.windows
  if (!browser.windows) {
    console.error('browser.windows API not available')
    return
  }

  return new Promise((resolve) => {
    browser.windows.getAll({ populate: true }, async (windows) => {
      const allTabs = []
      windows.forEach((win) => {
        win.tabs.forEach((tab) => {
          allTabs.push({
            url: tab.url,
            title: tab.title,
            windowId: win.id
          })
        })
      })
      await saveSession(allTabs, '')
      resolve()
    })
  })
}

export async function saveURLs(name, tags, tabs) {
  const storage = await getStorage(['savedURLs'])
  let URLs = {
    name,
    tags,
    tabs: tabs.map((tab) => ({ url: tab.url, title: tab.title })),
    created: +new Date()
  }
  // This seems to be a different feature (Saved URLs vs Sessions), keeping it simple for now or migrating it too?
  // The user asked for "Session feature... reduce size". savedURLs seems separate.
  // I'll keep it as is but using async storage.

  let savedURLs = storage.savedURLs || []
  savedURLs.push(URLs)
  await setStorage({ savedURLs })
}

export async function getSessions() {
  await migrateSessions() // Ensure migration

  const storage = await getStorage(['urlBank', 'sessions'])
  const urlBank = storage.urlBank || []
  const sessions = storage.sessions || []

  return sessions.map((session) => {
    const hydratedWindows = {}
    if (session.windows) {
      Object.keys(session.windows).forEach((winId) => {
        hydratedWindows[winId] = session.windows[winId].map((index) => {
          return urlBank[index] || { url: 'about:blank', title: 'Missing' }
        })
      })
    }
    return { ...session, windows: hydratedWindows }
  })
}

export async function removeSessions(sessionID) {
  const storage = await getStorage(['sessions'])
  let sessions = storage.sessions || []
  const newSessions = sessions.filter(
    (s) => String(s.created) !== String(sessionID)
  )
  await setStorage({ sessions: newSessions })
  return getSessions()
}

export async function renameSession(id, name) {
  const storage = await getStorage(['sessions'])
  let sessions = storage.sessions || []
  const session = sessions.find((s) => String(s.created) === String(id))
  if (session) {
    session.name = name
    await setStorage({ sessions })
  }
  return getSessions()
}

export async function removeTab(tabURL, windowId, sessionId) {
  // This is tricky with deduplication. We remove the index from the session.
  // We don't necessarily remove from urlBank as other sessions might use it.
  // Garbage collection for urlBank could be a separate task.

  const storage = await getStorage(['sessions', 'urlBank'])
  let sessions = storage.sessions || []
  let urlBank = storage.urlBank || []

  const session = sessions.find((s) => String(s.created) === String(sessionId))
  if (session && session.windows && session.windows[windowId]) {
    // We need to find the index that corresponds to tabURL
    // This is inefficient if multiple tabs have same URL.
    // But tabURL is passed as identifier.

    const indices = session.windows[windowId]
    const indexToRemove = indices.findIndex(
      (idx) => urlBank[idx] && urlBank[idx].url === tabURL
    )

    if (indexToRemove !== -1) {
      indices.splice(indexToRemove, 1)
      await setStorage({ sessions })
    }
  }
  return getSessions()
}

export async function exportSessions() {
  const storage = await getStorage(['sessions', 'urlBank'])
  return {
    sessions: storage.sessions || [],
    urlBank: storage.urlBank || [],
    exportedAt: Date.now(),
    version: '1.0'
  }
}

export async function importSessions(data, merge = true) {
  const storage = await getStorage(['sessions', 'urlBank'])

  if (merge) {
    // Merge with existing sessions
    const existingSessions = storage.sessions || []
    const existingUrlBank = storage.urlBank || []

    // Add new URLs to urlBank and update session references
    const urlMap = new Map()
    existingUrlBank.forEach((url, index) => {
      urlMap.set(url.url, index)
    })

    let newUrlBank = [...existingUrlBank]
    const importedSessions = data.sessions.map((session) => {
      const newWindows = {}
      Object.keys(session.windows).forEach((winId) => {
        newWindows[winId] = session.windows[winId]
          .map((oldIndex) => {
            const urlData = data.urlBank[oldIndex]
            if (!urlData) return -1

            if (urlMap.has(urlData.url)) {
              return urlMap.get(urlData.url)
            } else {
              const newIndex = newUrlBank.length
              newUrlBank.push(urlData)
              urlMap.set(urlData.url, newIndex)
              return newIndex
            }
          })
          .filter((idx) => idx !== -1)
      })
      return { ...session, windows: newWindows }
    })

    await setStorage({
      sessions: [...existingSessions, ...importedSessions],
      urlBank: newUrlBank
    })
  } else {
    // Replace all sessions
    await setStorage({
      sessions: data.sessions || [],
      urlBank: data.urlBank || []
    })
  }

  return getSessions()
}
