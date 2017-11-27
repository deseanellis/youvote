import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import registryReducer from './registryReducer';
import userReducer from './userReducer';
import pollReducer from './pollReducer';

const rootReducer = combineReducers({
  form: formReducer,
  registry: registryReducer,
  user: userReducer,
  poll: pollReducer
});

export default rootReducer;
