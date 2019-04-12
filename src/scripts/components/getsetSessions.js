let browser = require('webextension-polyfill');
// let allSessions = {
//   sessions: [],
// };
export function saveTabs(tabs) {
  let session = {
    created: +new Date(),
    modified: null,
    name: '',
    windows: {},
  };
  for (let i = 0; i < tabs.length; i++) {
    let strippedTabs = tabs.map((cur, index) => {
      let tab = {};
      tab['url'] = cur.url;
      tab['title'] = cur.title;
      return tab;
    });
    session.windows[0] = strippedTabs;
  }
  setIncStorage('sessions', session, window.sessions);
}
export function saveSessions(sessionsComponent) {
  browser.windows.getAll({ populate: true }).then(function(windows) {
    // let sessionsArray = [];
    let session = {
      created: +new Date(),
      modified: null,
      name: '',
      windows: {},
    };
    for (let i = 0; i < windows.length; i++) {
      let strippedTabs = windows[i].tabs.map((cur, index) => {
        let tab = {};
        tab['url'] = cur.url;
        tab['title'] = cur.title;
        return tab;
      });
      session.windows[windows[i].id] = strippedTabs;
    }
    // sessionsArray.push(session);
    setIncStorage('sessions', session, sessionsComponent);
    console.info('Session saved:', session);
  });
}

export function getSessions() {
  return browser.storage.local.get('sessions').then(items => {
    if (items.sessions == undefined || items.sessions == []) {
      console.error('No Session has been saved');
      return [];
    } else {
      return items.sessions;
    }
  });
}
//TODO
//Use timestamp as names to save sessions. and before saving look if tabs in current sessions are already saved in last session
//if yes then don't save session. and alert. Tabs from curent session already exist in previously saved session.

function setIncStorage(storagekey, newdata, sessionsComponent) {
  browser.storage.local.get([storagekey]).then(function(result) {
    //result[storagekey] ,oldData, = Array
    let sessionsArray = [];
    let oldData = result[storagekey] ? result[storagekey] : null;
    let jsonObj = {};
    console.log(oldData);
    if (oldData) {
      sessionsArray = [...oldData, newdata];
      jsonObj[storagekey] = sessionsArray;
      console.log(jsonObj);
      browser.storage.local.set(jsonObj).then(function() {
        sessionsComponent.setState({ data: sessionsArray });
        browser.notifications
          .create('reminder', {
            type: 'basic',
            iconUrl: '../images/extension-icon48.png',
            title: 'Data saved',
            message: 'A new Session has been saved!'
          })
          .then(function(notificationId) {});
      });
    } else {
      sessionsArray.push(newdata);
      jsonObj[storagekey] = sessionsArray;
      browser.storage.local.set(jsonObj).then(function() {
        if (sessionsComponent) sessionsComponent.setState({ data: sessionsArray });
        browser.notifications
          .create('reminder', {
            type: 'basic',
            iconUrl: '../images/extension-icon48.png',
            title: 'Data saved',
            message: 'Session has been saved.'
          })
          .then(function(notificationId) {});
      });
    }
  });
}
export function removeSessions(sessionID) {
  return getSessions().then(items => {
    let newData = items.filter(element => String(element.created) != String(sessionID));
    let jsonObj = {};
    jsonObj['sessions'] = newData;
    return browser.storage.local.set(jsonObj).then(() => getSessions());
  });
}
export function renameSession(id, name) {
  return getSessions().then(data => {
    let targetIndex = data.findIndex(element => element.created == id); /*?*/
    data[targetIndex].name = name;
    let jsonObj = {};
    jsonObj['sessions'] = data;
    return browser.storage.local.set(jsonObj).then(() => getSessions());
  });
}
export function removeTab(tabURL, windowId, sessionId) {
  return getSessions().then(data => {
    let Tabs = data[data.findIndex(element => element.created == sessionId)].windows[windowId];
    let newData = Tabs.filter(tab => tab.url != tabURL);
    data[data.findIndex(element => element.created == sessionId)].windows[windowId] = [...newData];
    let jsonObj = {};
    jsonObj['sessions'] = data;
    return browser.storage.local.set(jsonObj).then(() => getSessions());
  });
}
