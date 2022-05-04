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
      permissions: [
        "tabs",
        "contextMenus",
        "storage",
        "notifications",
        "unlimitedStorage",
      ],
      content_security_policy: {
        extension_pages:
          "script-src 'self' http://localhost:*; object-src 'self'",
      },
    };
  } else if (version === 2) {
    return {
      permissions: [
        "tabs",
        "contextMenus",
        "storage",
        "notifications",
        "unlimitedStorage",
      ],
    };
  }
};
module.exports = { getBackground, getPermissions };
