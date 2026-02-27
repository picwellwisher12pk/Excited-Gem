import type { PlasmoCSConfig } from 'plasmo'

export const config: PlasmoCSConfig = {
  matches: ['http://*/*', 'https://*/*']
}

/* eslint-disable no-console */
// import { onMessage } from "webext-bridge";
// import "./index.css";
// Firefox `browser.tabs.executeScript()` requires scripts return a primitive value
console.info('[vitesse-webext] Hello world from content script')

// communication example: send previous tab title from background page
// onMessage("tab-prev", ({ data }) => {
//   console.log(`[vitesse-webext] Navigate from page "${data.title}"`);
// });

// mount component to context window
// const shadowDOM = container.attachShadow?.({ mode: __DEV__ ? 'open' : 'closed' }) || container
// styleEl.setAttribute('rel', 'stylesheet')
// styleEl.setAttribute('href', browser.runtime.getURL('dist/contentScripts/style.css'))
// ReactDOM.createRoot(document.getElementById("root")).render(<h1>options</h1>);
