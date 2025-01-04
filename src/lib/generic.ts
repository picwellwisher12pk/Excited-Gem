export const isFF = /Firefox/.test(navigator.userAgent);
export async function capture(captureType: 'visible' | 'all' | 'selection') {
  const dataUrl = await chrome.tabs.captureVisibleTab(null, {format: 'png'}) as unknown as RequestInfo | URL;

  if (captureType==='visible') {
    return fetch(dataUrl).then(r => r.blob());
  }
  debugger;
  const left = captureType.left * captureType.devicePixelRatio;
  const top = captureType.top * captureType.devicePixelRatio;
  const width = captureType.width * captureType.devicePixelRatio;
  const height = captureType.height * captureType.devicePixelRatio;

  const canvas : OffscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');

  const blob = await fetch(dataUrl).then(r => r.blob());
  const prefs = await chrome.storage.local.get({
    quality: 0.95
  });

  const img = await createImageBitmap(blob);

  if (width && height) {
    ctx.drawImage(img, left, top, width, height, 0, 0, width, height);
  }
  else {
    ctx.drawImage(img, 0, 0);
  }
  return canvas.convertToBlob({
    type: 'image/png',
    quality: prefs.quality
  });
}

export const sanitizeFilename = (filename:string) => {
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
export async function copy(content, tab) {
  // Firefox
  try {
    await navigator.clipboard.writeText(content);
  }
  catch (e) {
    try {
      await chrome.scripting.executeScript({
        target: {
          tabId: tab.id
        },
        func: content => {
          navigator.clipboard.writeText(content).catch(() => chrome.runtime.sendMessage({
            method: 'copy-interface',
            content
          }));
        },
        args: [content]
      });
    }
    catch (e) {
      copy.interface(content);
    }
  }
}
copy.interface = async (value, type = 'content') => {
  const win = await chrome.windows.getCurrent();
  const args = new URLSearchParams();
  args.set(type, value);

  chrome.windows.create({
    url: '/data/copy/index.html?' + args.toString(),
    width: 400,
    height: 300,
    left: win.left + Math.round((win.width - 400) / 2),
    top: win.top + Math.round((win.height - 300) / 2),
    type: 'popup'
  });
};

export async function save(blob, tab) {
  // const prefs = await chrome.storage.local.get({
  //   'saveAs': false,
  //   'save-disk': true,
  //   'edit-online': false,
  //   'save-clipboard': false,
  //   'mask': '[date] - [time] - [title]'
  // });
    // prefs.saveAs = false; // saveAs is not supported on v3

  const filename = '[date] - [time] - [title]'
    .replace('[title]', tab.title)
    .replace('[date]', new Intl.DateTimeFormat('en-CA').format())
    .replace('[time]', new Intl.DateTimeFormat('en-CA', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format());

  // convert to data uri with caching
  const href = () => {
    if (typeof blob === 'string') {
      return Promise.resolve(blob);
    }
    if (href.cache) {
      return Promise.resolve(href.cache);
    }

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        href.cache = reader.result;
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  // save to clipboard
  // if (prefs['save-clipboard']) {
  //   chrome.scripting.executeScript({
  //     target: {tabId: tab.id},
  //     func: async href => {
  //       try {
  //         const blob = await fetch(href).then(r => r.blob());
  //         await navigator.clipboard.write([new ClipboardItem({
  //           'image/png': blob
  //         })]);
  //       }
  //       catch (e) {
  //         chrome.runtime.sendMessage({
  //           method: 'save-to-clipboard',
  //           href
  //         });
  //       }
  //     },
  //     args: [await href()],
  //     injectImmediately: true
  //   });
  // }
  // edit online
  // if (prefs['edit-online']) {
  //   const hd = await href();
  //   const id = Math.random();
  //   save.cache[id] = hd;
  //   chrome.tabs.create({
  //     url: 'https://webbrowsertools.com/jspaint/pwa/build/index.html#gid=' + id
  //   });
  // }
  // save to disk
  // if (prefs['save-disk'] || (prefs['save-clipboard'] === false && prefs['edit-online'] === false)) {
    let url;
    if (isFF) {
      if (typeof blob === 'string') {
        const b = await fetch(blob).then(r => r.blob());
        url = URL.createObjectURL(b);
      }
      else {
        url = URL.createObjectURL(blob);
      }
    }
    else {
      url = await href();
    }

    chrome.downloads.download({
      url,
      filename: filename + '.png',
      saveAs: true
    }, () => {
      const lastError = chrome.runtime.lastError;
      if (lastError) {
        chrome.downloads.download({
          url,
          filename: sanitizeFilename(filename) + '.png',
          saveAs: true
        }, () => {
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            chrome.downloads.download({
              url,
              filename: 'image.png',
              saveAs: true
            });
          }
        });
      }
    });
  // }
}
save.cache = {};