module.exports = {
  "background": {
    "scripts": ["js/background.js"],
    "persistent": false
  },

  "permissions": [
    "tabs",
    "<all_urls>",
    "contextMenus",
    "storage",
    "notifications"
  ]
}
