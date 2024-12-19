// import "react-devtools";

import {Provider} from 'react-redux'

import ActiveTabs from '/src/scripts/ActiveTabs'
import store from '/src/store/store.js'

import 'antd/dist/reset.css'
import '/src/styles/index.css'
import '/src/styles/index.scss'
import 'react-custom-scroll/dist/customScroll.css'
import {StrictMode} from 'react'

function Home() {
  console.log('home')
  return (
    <StrictMode>
      <Provider store={store}>
        <ActiveTabs/>
        {/* <PersistGate loading={null} persistor={persistor}>
        </PersistGate> */}
      </Provider>
    </StrictMode>
  )
}

export default Home
