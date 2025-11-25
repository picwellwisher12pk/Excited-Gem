// import ACTIONS from './action';
import _ from 'lodash';

const rootReducer = (state = {}, action) => {
  switch (action.type) {


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
