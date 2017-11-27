import {
  GET_USER,
  LOGIN_USER,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD
} from '../actions/types';
const INITIAL_STATE = {
  requestReceived: 0,
  loggedIn: null,
  user: null,
  warning: null,
  error: null
};

const userReducer = (state = INITIAL_STATE, action) => {
  var requestReceived = state.requestReceived + 1;
  switch (action.type) {
    case GET_USER:
      if (action.payload.success) {
        return {
          ...state,
          loggedIn: true,
          user: action.payload.user
        };
      }
      return { ...state, loggedIn: false, user: { fullName: 'Guest' } };
    case LOGIN_USER:
      if (action.payload.success) {
        return {
          ...state,
          requestReceived,
          loggedIn: true,
          warning: null,
          error: null
        };
      }

      if (action.payload.warning) {
        return {
          ...state,
          loggedIn: false,
          requestReceived,
          warning: action.payload.warning
        };
      }

      if (action.payload.error) {
        return {
          ...state,
          loggedIn: false,
          requestReceived,
          error: action.payload.error
        };
      }
      return state;
    case CHANGE_PASSWORD:
      if (action.payload.success) {
        return {
          ...state,
          requestReceived,
          warning: null,
          error: null
        };
      }

      if (action.payload.warning) {
        return {
          ...state,
          requestReceived,
          warning: action.payload.warning
        };
      }

      if (action.payload.exception) {
        return {
          ...state,
          requestReceived,
          error: 'Request failed'
        };
      }

      if (action.payload.error) {
        return {
          ...state,
          requestReceived,
          error: action.payload.error
        };
      }

      return state;
    case FORGOT_PASSWORD:
      if (action.payload.success) {
        return { ...state, requestReceived, warning: null, error: null };
      }

      if (action.payload.warning) {
        return { ...state, requestReceived, warning: action.payload.warning };
      }

      if (action.payload.exception) {
        return { ...state, requestReceived, error: 'Request failed' };
      }

      if (action.payload.error) {
        return { ...state, requestReceived, error: action.payload.error };
      }
      return state;
    default:
      return state;
  }
};

export default userReducer;
