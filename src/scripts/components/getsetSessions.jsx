import packagedAndBroadcast from "./communications.js";
let allSessions = {
  sessions : []
};

export function saveSessions(sender) {
  chrome.windows.getAll({ populate: true }, function (windows) {
    var session = {
      created: +new Date(),
      modified: null,
      name: '',
      windows: []
    };
    for (var i = 0; i < windows.length; i++) {
      session.windows[i] = windows[i].tabs;
    }
    setIncStorage(sessions,session);
    console.info("Session saved:", session);
    packagedAndBroadcast(sender, 'content', 'get_sessions', windows.tabs);
  });
}

export function getSessions(sessions) {
  chrome.storage.local.get("sessions", function (items) {
    allSessions = items.sessions;
    if (allSessions == undefined || allSessions == []) {
      console.error("No Session has been saved");
      return false;
    }
    sessions.setState({ data: allSessions });
    console.log("content.js get all sessions", allSessions);
    return items.sessions;
  });
};
//TODO
//Use timestamp as names to save sessions. and before saving look if tabs in current sessions are already saved in last session
//if yes then don't save session. and alert. Tabs from curent session already exist in previously saved session.

function setIncStorage(storagekey, newdata, arrayName) {
  chrome.storage.local.get([storagekey], function (result) {
    var object = result[storagekey] ? result[storagekey] : null;
    var jsonObj = {};
    if (object) {
      object.push(newdata);
      jsonObj[storagekey] = object;
      chrome.storage.local.set(jsonObj, function () {
        chrome.notifications.create(
          "reminder",
          {
            type: "basic",
            iconUrl: "../images/extension-icon48.png",
            title: "Data saved",
            message: "A new Session has been saved!"
          },
          function(notificationId) {}
        );
      });
    }
    else {
      jsonObj[storagekey] = newdata;
      chrome.storage.local.set(jsonObj, function () {
        chrome.notifications.create(
          "reminder",
          {
            type: "basic",
            iconUrl: "../images/extension-icon48.png",
            title: "Data saved",
            message: "First session has been saved."
          },
          function(notificationId) {}
        );
      });
    }

  });
}
