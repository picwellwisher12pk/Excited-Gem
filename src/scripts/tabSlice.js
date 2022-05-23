import { createSlice } from "@reduxjs/toolkit";

export const tabSlice = createSlice({
  name: "tabs",
  initialState: {
    tabs: [],
    selectedTabs: [],
    selectedWindow: "current",
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateActiveTabs: (state, action) => {
      state.tabs = [];
      state.tabs = [...action.payload];
    },
    updateSelectedTabs: (state, action) => {
      let { id, selected } = action.payload;
      selected
        ? state.selectedTabs.push(id)
        : state.selectedTabs.splice(state.selectedTabs.indexOf(id), 1);
      window.selectedTabs = [...state.selectedTabs];
    },
    clearSelectedTabs: (state) => {
      state.selectedTabs = [];
      window.selectedTabs = [];
    },
    updateSelectedWindow: (state, action) => {
      state.selectedWindow = action.payload;
      window.selectedWindow = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateActiveTabs,
  updateSelectedTabs,
  clearSelectedTabs,
  updateSelectedWindow,
} = tabSlice.actions;

export default tabSlice.reducer;
