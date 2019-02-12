let browser = require("webextension-polyfill");
let allSessions = {
    sessions: []
};

export function saveSessions(sessionsComponent) {
    browser.windows.getAll({ populate: true }).then(function(windows) {
        // let sessionsArray = [];
        let session = {
            created: +new Date(),
            modified: null,
            name: '',
            windows: []
        };
        for (let i = 0; i < windows.length; i++) {
            session.windows[i] = windows[i].tabs;
        }
        // sessionsArray.push(session);
        setIncStorage("sessions", session,sessionsComponent);
        console.info("Session saved:", session);
    });
}

export function getSessions(sessionsComponent) {
    // console.log(browser.storage.local.get('sessions').then((item)=> item));
    browser.storage.local.get("sessions").then((items)=> {
        let sessions = items.sessions;
        console.log(items.sessions);
        if (sessions == undefined || sessions == []) {
            console.error("No Session has been saved");
            return false;
        }
        sessionsComponent.setState({ data: sessions });
        // return items.sessions;
    });
};
//TODO
//Use timestamp as names to save sessions. and before saving look if tabs in current sessions are already saved in last session
//if yes then don't save session. and alert. Tabs from curent session already exist in previously saved session.

function setIncStorage(storagekey, newdata,sessionsComponent) {
    browser.storage.local.get([storagekey]).then(function(result) {
        //result[storagekey] ,oldData, = Array
        let sessionsArray = [];
        let oldData = result[storagekey] ? result[storagekey] : null;
        let jsonObj = {};
        // console.log(oldData);
        if (oldData) {
            sessionsArray=[...oldData,newdata];
            jsonObj[storagekey] = sessionsArray;
            // console.log(jsonObj);
            browser.storage.local.set(jsonObj).then(function() {
                sessionsComponent.setState({ data: sessionsArray });
                browser.notifications.create(
                    "reminder", {
                        type: "basic",
                        iconUrl: "../images/extension-icon48.png",
                        title: "Data saved",
                        message: "A new Session has been saved!"
                    }).then(function(notificationId) {}
                );
            });
        } else {
            console.log("else");
            sessionsArray.push(newdata);
            console.log(sessionsArray,newdata);
            jsonObj[storagekey] = sessionsArray;
            browser.storage.local.set(jsonObj).then(function() {
                sessionsComponent.setState({ data: sessionsArray });
                browser.notifications.create(
                    "reminder", {
                        type: "basic",
                        iconUrl: "../images/extension-icon48.png",
                        title: "Data saved",
                        message: "First session has been saved."
                    }).then(function(notificationId) {}
                );
            });
        }

    });
}