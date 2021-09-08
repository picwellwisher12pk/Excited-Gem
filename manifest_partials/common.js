module.exports = {
  background: {
    service_worker: "background-wrapper.js",
    type: "module",
  },

  permissions: ["tabs", "contextMenus", "storage", "notifications"],
  host_permissions: ["*", "*://*/*"],
};
