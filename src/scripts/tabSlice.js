import { createSlice } from "@reduxjs/toolkit";

export const tabSlice = createSlice({
  name: "tabs",
  initialState: {
    tabs: [],
    selectedTabs: [],
    filteredTabs: [],
    selectedWindow: "current",
  },
  reducers: {
    updateActiveTabs: (state, action) => {
      state.tabs = action.payload;
    },
    updateSelectedTabs: (state, action) => {
      let { id, selected } = action.payload;
      selected
        ? state.selectedTabs.push(id)
        : state.selectedTabs.splice(state.selectedTabs.indexOf(id), 1);
      window.selectedTabs = [...state.selectedTabs];
    },
    updateFilteredTabs: (state, action) => {
      state.filteredTabs = [...action.payload];
      window.filteredTabs = [...action.payload];
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
  updateFilteredTabs,
  clearSelectedTabs,
  updateSelectedWindow,
} = tabSlice.actions;

export default tabSlice.reducer;
