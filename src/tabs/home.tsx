// import "react-devtools";

import { Provider } from 'react-redux'

import ActiveTabs from '/src/scripts/ActiveTabs'
import store from '/src/scripts/store.js'

import 'antd/dist/reset.css'
import '/src/styles/index.css'
import '/src/styles/index.scss'
import 'react-custom-scroll/dist/customScroll.css'


function Home() {
  console.log('home')
  return (
    <Provider store={store}>
      <ActiveTabs />
      {/* <PersistGate loading={null} persistor={persistor}>
      </PersistGate> */}
    </Provider>
  )
}

export default Home
