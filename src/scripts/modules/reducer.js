// import ACTIONS from './action';
import _ from 'lodash';

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_TABS': {
      let newState = _.cloneDeep(state);
      newState.tabs = [];
      newState.tabs = _.cloneDeep(action.payload);
      return newState;
    }
    case 'UPDATE_SEARCH_TERM': {
      let newState = _.cloneDeep(state);
      action.payload !== '' ? newState.preferences.search.empty = false : newState.preferences.search.empty = true;
      newState.preferences.searchTerm = action.payload;
      return newState;
    }
    case 'UPDATE_SELECTED_TABS': {
      let newState = _.cloneDeep(state);
      newState.selectedTabs = action.payload;
      return newState;
    }
    case 'TOGGLE_SEARCH_IN': {
      let newState = _.cloneDeep(state);
      newState.preferences.search.searchIn = action.payload;
      return newState;
    }

    default:
      return state;
  }
};

export default rootReducer;
