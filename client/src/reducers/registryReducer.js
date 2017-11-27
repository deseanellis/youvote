import { REGISTER_USER } from '../actions/types';
const INITIAL_STATE = {
  requestReceived: 0,
  registered: false,
  email: null,
  warning: null,
  error: null
};

const registryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_USER:
      var requestReceived = state.requestReceived + 1;
      if (action.payload.success) {
        return {
          ...state,
          requestReceived: requestReceived,
          registered: true,
          email: action.payload.email
        };
      }
      if (action.payload.warning) {
        return {
          ...state,
          requestReceived: requestReceived,
          registered: true,
          email: action.payload.email,
          warning: action.payload.warning
        };
      }
      if (action.payload.error) {
        return {
          ...state,
          requestReceived: requestReceived,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          requestReceived: requestReceived,
          error: 'System error. Please try again later.'
        };
      }
      break;
    default:
      return state;
  }
};

export default registryReducer;
