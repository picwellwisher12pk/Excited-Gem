import { createSlice } from "@reduxjs/toolkit";
import _ from "lodash";

export const tabSlice = createSlice({
  name: "tabs",
  initialState: {
    tabs: [],
    selectedTabs: [],
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateActiveTabs: (state, action) => {
      let newState = _.cloneDeep(state);
      newState.tabs = [];
      newState.tabs = _.cloneDeep(action.payload);
      return newState;
    },
    updateSelectedTabs: (state, action) => {
      let newState = _.cloneDeep(state);
      let { id, selected } = action.payload;
      selected
        ? newState.selectedTabs.push(id)
        : newState.selectedTabs.splice(newState.selectedTabs.indexOf(id), 1);
      window.selectedTabs = newState.selectedTabs;
      return newState;
    },
    clearSelectedTabs: (state) => {
      let newState = _.cloneDeep(state);
      newState.selectedTabs = [];
      window.selectedTabs = [];
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateActiveTabs,
  updateSelectedTabs,
  clearSelectedTabs,
} = tabSlice.actions;

export default tabSlice.reducer;
