module.exports = {
  "background": {
    "scripts": ["js/background.js"],
    "persistent": false
  },
  // "commands": {
  //   "execute_browser_action": {
  //     "description": "Display Excited Gem Tabs Page",
  //     "suggested_key": {
  //       "windows": "Ctrl+Shift+X"
  //     }
  //   }
  // },
  "permissions": [
    "tabs",
    "<all_urls>",
    "contextMenus",
    "storage",
    "notifications"
  ]
}