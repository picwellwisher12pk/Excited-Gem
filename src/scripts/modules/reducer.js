// import ACTIONS from './action';
import _ from 'lodash';
import { getTabs } from '../components/browserActions';

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_ACTIVE_TABS': {
      let newState = _.cloneDeep(state);
      newState.tabs = [];
      newState.tabs = _.cloneDeep(action.payload);
      return newState;
    }

    default:
      return state;
  }
};

export default rootReducer;
