// import "react-devtools";

import {Provider} from 'react-redux'
import ActiveTabs from '~/scripts/ActiveTabs'
import store from '~/store/store'

import 'antd/dist/reset.css'
import '~/styles/index.css'
import '~/styles/index.scss'
import {StrictMode} from 'react'
import {ConfigProvider} from "antd";

function Home() {
  return (
    <StrictMode>
      <Provider store={store}>
        <ConfigProvider theme={{
          token: {
            borderRadius: 2,
            borderRadiusSM: 2,
            borderRadiusLG: 2
          }
        }}>
          <ActiveTabs/>
          {/* <PersistGate loading={null} persistor={persistor}>
        </PersistGate> */}
        </ConfigProvider>
      </Provider>
    </StrictMode>
  )
}

export default Home
