import {createSlice} from '@reduxjs/toolkit'
import {preferences} from './defaultPreferences';

export const configSlice = createSlice({
  name: 'config',
  initialState: {
    ...preferences,
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateActiveTabs: (state,action) => {
      let newState = _.cloneDeep(state);
      newState.tabs = [];
      newState.tabs = _.cloneDeep(action.payload);
      return newState;
    },
     updateSelectedTabs:(state,action) => {
      let newState = _.cloneDeep(state);
      newState.selectedTabs = action.payload;
      return newState;
    },
  },
})

// Action creators are generated for each case reducer function
// export const {updateActiveTabs, updateSelectedTabs} = configSlice.actions

export default configSlice.reducer
