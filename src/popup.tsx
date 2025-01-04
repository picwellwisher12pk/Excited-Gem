import React, { useEffect, useState } from "react"

const styles = {
  button: {
    padding: 5
  }
}
function IndexPopup() {
  const [tab, setTab] = useState(null)


  const initiateCapture = (area: 'visible' | 'all' | 'selection') => {
    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, (tab) => {
      console.log(tab[0].id, 'area:', area);
      chrome.runtime.sendMessage({
        method: 'capture',
        area: area,
        tabId: tab[0].id
      }, (response) => {
        console.log('response', response);
        // window.close();
      });
    });

  }


  return (
    <div style={{ minWidth: 200, display: 'flex', gap: '10px', flexDirection: 'column' }}>
      <button onClick={() => initiateCapture('visible')} type="button" style={styles.button}>Capture Visible</button>
      <button onClick={() => initiateCapture('all')} type="button" style={styles.button}>Capture All</button>
      <button onClick={() => initiateCapture('selection')} type="button" style={styles.button}>Capture Selection</button>
    </div>
  )
}

export default IndexPopup
