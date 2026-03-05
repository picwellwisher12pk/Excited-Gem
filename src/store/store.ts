import { configureStore } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import tabReducer from './tabSlice'
import configReducer from './configSlice'
import searchReducer from './searchSlice'

const store = configureStore({
  reducer: {
    tabs: tabReducer,
    config: configReducer,
    search: searchReducer
  },
  middleware: (getDefaultMiddleware) => {
    const middleware = getDefaultMiddleware()
    if (process.env.NODE_ENV === 'development') {
      return middleware.concat(logger)
    }
    return middleware
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
