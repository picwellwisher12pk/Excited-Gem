import { createSlice } from "@reduxjs/toolkit";
import { preferences } from "../scripts/defaultPreferences";

const searchIn = { ...preferences.search.searchIn };
const regex = preferences.search.regex || false;
export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    searchIn,
    audibleSearch: false,
    pinnedSearch: false,
    regex,
  },
  reducers: {
    updateSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    toggleRegex: (state) => {
      state.regex = !state.regex;
    },
    setRegex: (state, action) => {
      state.regex = action.payload;
    },
    toggleSearchIn: (state, action) => {
      state.searchIn = { ...action.payload };
    },
    toggleAudible: (state) => {
      state.audibleSearch = !state.audibleSearch;
    },
    togglePinned: (state) => {
      state.pinnedSearch = !state.pinnedSearch;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  updateSearchTerm,
  toggleSearchIn,
  toggleAudible,
  togglePinned,
  toggleRegex,
} = searchSlice.actions;

export default searchSlice.reducer;
