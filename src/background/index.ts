// import 'webextension-polyfill';
// import { exampleThemeStorage } from '@extension/storage';

import { capture } from "../../lib/generic";


// const isFF = /Firefox/.test(navigator.userAgent);
// chrome.runtime.onConnect.addListener(p => {
//   p.onDisconnect.addListener(() => {
//     console.info('port is closed', p.name);
//   });
// });

const notify = e => chrome.notifications.create({
  type: 'basic',
  iconUrl: '/data/icons/48.png',
  title: chrome.runtime.getManifest().name,
  message: e.message || e
}, id => setTimeout(chrome.notifications.clear, 5000, id));

const sanitizeFilename = filename => {
  // Common replacements
  filename = filename.replace(/[\\/:"*?<>|]/g, '_'); // Replace disallowed characters with underscores
  filename = filename.replace(/^\.+/g, ''); // Remove leading periods

  // OS-specific restrictions
  const platform = navigator.platform.toLowerCase();
  if (platform.includes('win')) {
    // Windows specific restrictions
    filename = filename.replace(/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i, ''); // Remove reserved file names
    filename = filename.replace(/[\x00-\x1F\x7F-\x9F]/g, '_'); // Remove control characters
    filename = filename.substring(0, 255); // Windows max filename length is 255 characters
  }
  else if (platform.includes('mac') || platform.includes('linux')) {
    // macOS and Linux specific restrictions
    filename = filename.trim(); // Trim leading/trailing whitespace
    filename = filename.replace(/^\./g, ''); // Remove leading periods
    filename = filename.substring(0, 255); // macOS and Linux max filename length is 255 characters
  }

  return filename;
};
chrome.runtime.onMessage.addListener((requestType, sender, sendResponse) => {
    console.log('requestType', requestType);
  if (requestType.method === 'capture') {
    capture(requestType.area).then(sendResponse);
    return true;
  }
})
