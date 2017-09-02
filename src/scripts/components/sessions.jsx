let allSessions ;
function get_sessions(){
      chrome.storage.local.get("sessions", function (items) {
          allSessions = items.sessions;
          console.log("get all sessions",allSessions);
          Sessions.setState({data:allSessions});
          return items.sessions;
      }
}
  getLastSession = () => {
    chrome.storage.local.get("session", function(items) {
      console.log(items.session);
    });
  };
