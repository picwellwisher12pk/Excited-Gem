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
  youtubeInfo?: {
    duration: number;
    currentTime: number;
    paused: boolean;
    title: string;
    percentage: number;
    tabId: number;
  };
}

interface TabState {
  tabs: Tab[];
  filteredTabs: Tab[];
  selectedTabs: number[];
  selectedWindow: number;
  youtubePermissionGranted: boolean;
  isSelectionMode: boolean; // Add selection mode state
}

const initialState: TabState = {
  tabs: [],
  filteredTabs: [],
  selectedTabs: [],
  selectedWindow: chrome.windows?.WINDOW_ID_CURRENT || -1,
  youtubePermissionGranted: false,
  isSelectionMode: false, // Default false
};

export const tabSlice = createSlice({
  name: "tabs",
  initialState,
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
    updateYouTubeInfo: (state, action) => {
      const { tabId, info } = action.payload;
      const tab = state.tabs.find((t) => t.id === tabId);
      if (tab) {
        tab.youtubeInfo = info;
      }
      const filteredTab = state.filteredTabs.find((t) => t.id === tabId);
      if (filteredTab) {
        filteredTab.youtubeInfo = info;
      }
    },
    updateYouTubePermission: (state, action) => {
      state.youtubePermissionGranted = action.payload;
    },
    toggleSelectionMode: (state, action) => {
      state.isSelectionMode = action.payload;
      // If turning off, clear selection? Maybe not, user might want to keep selection but exit mode.
      // For now, let's keep separate actions.
      if (!action.payload) {
        state.selectedTabs = []; // Clear selection when exiting mode? Review requirement.
      }
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
  updateYouTubeInfo,
  updateYouTubePermission,
  toggleSelectionMode,
} = tabSlice.actions;

export default tabSlice.reducer;
