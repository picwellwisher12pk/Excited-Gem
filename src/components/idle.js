chrome.idle.setDetectionInterval(30)
chrome.idle.onStateChanged.addListener((newState) => {
  if (newState == 'idle') {
    console.log('idle')
  }
})
