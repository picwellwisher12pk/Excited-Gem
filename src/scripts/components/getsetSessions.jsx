let allSessions;
export function saveSessions() {
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
    allSessions.sessions.push(session);
    chrome.storage.local.set(allSessions, function () {
      chrome.notifications.create('reminder', {
        type: 'basic',
        iconUrl: '../images/extension-icon48.png',
        title: 'Data saved',
        message: "Session Saved"
      }, function (notificationId) { });
    });
    console.log("window tabs in saveSessionsbackground", session);
    packageAndBroadcast(sender, 'content', 'get_sessions', windows.tabs);
  });
}
export function getSessions() {
  chrome.storage.local.get("sessions", function (items) {
    allSessions = items.sessions;
    if (allSessions == undefined || allSessions == []) {
      console.error("No Session has been saved");
      return false;
    }

    // sessions.setState({ data: allSessions });
    console.log("content.js get all sessions", allSessions);
    return items.sessions;
  });
};
//Use timestamp as names to save sessions. and before saving look if tabs in current sessions are already saved in last session
//if yes then don't save session. and alert. Tabs from curent session already exist in previously saved session.
// function saveSessions() {
//    chrome.windows.getAll({populate:true}, function(windows){
//        let sessionData = {
//          created : new Date(),
//          modified : null,
//          name : '',
//          windows : []
//        };

//     for(var i=0;i<windows.length;i++){
//       let windowsTab = [];
//       for (let j =0; j< windows[i].tabs.length;j++){
//         windowsTab.push(removeKeys(ignoredDataKeys,windows[i].tabs[j]));
//       }
//       sessionData.windows[i] = windowsTab;
//       console.log("saveSession background", sessionData); //Array of Objects
//     }
//     setIncStorage('sessions',sessionData,"sessions");
//     packagedAndBroadcast(sender,'content','get_sessions',null)
// //   });

// }
function setIncStorage(storagekey, newdata, arrayName) {
  chrome.storage.local.get([storagekey], function (result) {
    var object = result[storagekey] ? result[storagekey] : null;
    var jsonObj = {};
    if (object) {
      object.push(newdata);
      jsonObj[storagekey] = object;
      chrome.storage.local.set(jsonObj, function () {
        console.log("Saved a new array item");
      });
    }
    else {
      jsonObj[storagekey] = newdata;
      chrome.storage.local.set(jsonObj, function () {
        console.log("Saved a new array item");
      });
    }

  });
}
// getLastSession = () => {
//   chrome.storage.local.get("session", function (items) {
//     console.log(items.session);
//   });
// };
