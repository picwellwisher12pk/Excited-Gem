import { createSlice } from "@reduxjs/toolkit";

export interface Tab {
  id: number;
  title: string;
  url: string;
  favIconUrl?: string;
  pinned: boolean;
  audible: boolean;
  muted: boolean;
  mutedInfo: { muted: boolean };
  discarded: boolean;
  status: 'loading' | 'complete' | 'error';
  index: number;
  windowId: number;
  groupId?: number;
}

export const tabSlice = createSlice({
  name: "tabs",
  initialState: {
    tabs: [] as Tab[],
    windows: [],
    selectedTabs: [] as number[],
    filteredTabs: [] as Tab[],
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
    selectAllTabs: (state) => {
      state.selectedTabs = [...state.filteredTabs.map((tab) => tab.id)];
    },
    invertSelectedTabs: (state) => {
      state.selectedTabs = [
        ...state.filteredTabs
          .filter((tab) => !state.selectedTabs.includes(tab.id))
          .map((tab) => tab.id),
      ];
    },
    updateSelectedWindow: (state, action) => {
      console.log("updateSelectedWindow:", action.payload);
      state.selectedWindow = action.payload;
      window.selectedWindow = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  selectAllTabs,
  invertSelectedTabs,
  updateActiveTabs,
  updateSelectedTabs,
  updateFilteredTabs,
  clearSelectedTabs,
  updateSelectedWindow,
} = tabSlice.actions;

export default tabSlice.reducer;
