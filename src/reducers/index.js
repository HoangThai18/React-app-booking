import { combineReducers } from 'redux';

import userReducer from './user';
import configReducer from './config';
import selectedRoomReducer from './selectedRoom';

export const allReducers = combineReducers({
  userReducer,
  configReducer,
  selectedRoomReducer,
});

export default allReducers;
