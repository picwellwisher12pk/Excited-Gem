const getBackground = (version) => {
  if (version === 3) {
    return {
      service_worker: "background.js",
      type: "module",
    };
  } else if (version === 2) {
    return {
      scripts: ["background.js"],
    };
  }
};
const getPermissions = (version) => {
  if (version === 3) {
    return {
      permissions: ["tabs", "contextMenus", "storage", "notifications"],
      optional_permissions: ["unlimitedStorage"],
    };
  } else if (version === 2) {
    return {
      permissions: ["tabs", "contextMenus", "storage", "notifications"],
    };
  }
};
module.exports = { getBackground, getPermissions };
