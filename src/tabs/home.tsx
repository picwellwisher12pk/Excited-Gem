// import "react-devtools";

import { Provider } from 'react-redux'

import ActiveTabs from '~/scripts/ActiveTabs'
import store from '~/store/store.js'

import 'antd/dist/reset.css'
import '~/styles/index.css'
import '~/styles/index.scss'
import { StrictMode } from 'react'

function Home() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ActiveTabs />
        {/* <PersistGate loading={null} persistor={persistor}>
        </PersistGate> */}
      </Provider>
    </StrictMode>
  )
}

export default Home
