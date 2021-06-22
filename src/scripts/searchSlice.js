import {createSlice} from "@reduxjs/toolkit";
import _ from "lodash";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    searchTerm: "",
    audibleSearch: false,
    pinnedSearch: false,
  },
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    updateSearchTerm: (state, action) => {
      let newState = _.cloneDeep(state);
      // action.payload !== ""
      //   ? (newState.preferences.search.empty = false)
      //   : (newState.preferences.search.empty = true);
      newState.searchTerm = action.payload;
      return newState;
    },
    toggleSearchIn: (state, action) => {
      let newState = _.cloneDeep(state);
      newState.preferences.search.searchIn = action.payload;
      return newState;
    },
    toggleAudible: (state) => {
      let newState = _.cloneDeep(state);
      newState.audibleSearch = !state.audibleSearch;
      return newState;
    },
    togglePinned: (state) => {
      let newState = _.cloneDeep(state);
      newState.pinnedSearch = !state.pinnedSearch;
      return newState;
    },
  },
});

// Action creators are generated for each case reducer function
export const {updateSearchTerm, toggleSearchIn, toggleAudible, togglePinned} = searchSlice.actions;

export default searchSlice.reducer;
