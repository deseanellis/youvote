import _ from 'lodash';

import {
  CREATE_POLL,
  EDIT_POLL,
  GET_POLL,
  GET_EDIT_POLL,
  REG_VOTE,
  GET_ALL_POLLS,
  ADD_TO_POLL_LIST,
  DELETE_POLLS,
  SEARCH_POLLS
} from '../actions/types';

const INITIAL_STATE = {
  requestReceived: 0,
  error: null,
  warning: null,
  polls: null,
  currentPoll: null,
  chartPoll: null,
  pollList: [],
  searchResults: null
};

const pollReducer = (state = INITIAL_STATE, action) => {
  var requestReceived = state.requestReceived + 1;
  switch (action.type) {
    case CREATE_POLL:
      if (action.payload.success) {
        return { ...state, requestReceived, currentPoll: action.payload.poll };
      }

      if (action.payload.warning) {
        return {
          ...state,
          requestReceived,
          warning: action.payload.warning
        };
      }
      if (action.payload.error) {
        return {
          ...state,
          requestReceived,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          requestReceived,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    case EDIT_POLL:
      if (action.payload.success) {
        return {
          ...state,
          requestReceived,
          currentPoll: action.payload.poll,
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
      if (action.payload.error) {
        return {
          ...state,
          requestReceived,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          requestReceived,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    case GET_POLL:
    case REG_VOTE:
      if (action.payload.success) {
        return {
          ...state,
          requestReceived,
          currentPoll: action.payload.poll,
          chartPoll: action.payload.groups
        };
      }

      if (action.payload.warning) {
        return {
          ...state,
          currentPoll: false,
          warning: action.payload.warning
        };
      }
      if (action.payload.error) {
        return {
          ...state,
          currentPoll: false,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          currentPoll: false,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    case GET_EDIT_POLL:
      if (action.payload.success) {
        return {
          ...state,
          requestReceived: 0,
          currentPoll: action.payload.poll,
          chartPoll: action.payload.groups
        };
      }

      if (action.payload.warning) {
        return {
          ...state,
          requestReceived: 0,
          currentPoll: false,
          warning: action.payload.warning
        };
      }
      if (action.payload.error) {
        return {
          ...state,
          requestReceived: 0,
          currentPoll: false,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          requestReceived: 0,
          currentPoll: false,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    case GET_ALL_POLLS:
      if (action.payload.success) {
        return {
          ...state,
          polls: action.payload.polls
        };
      }

      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          error: 'System error. Please try again later.'
        };
      }

      return state;
    case ADD_TO_POLL_LIST:
      let pollList = [...state.pollList];
      if (pollList.indexOf(action.payload) === -1) {
        pollList.push(action.payload);
      } else {
        _.remove(pollList, function(n, i) {
          return i === pollList.indexOf(action.payload);
        });
      }

      return { ...state, pollList };
    case DELETE_POLLS:
      if (action.payload.success) {
        return {
          ...state,
          polls: null,
          requestReceived
        };
      }

      if (action.payload.error) {
        return {
          ...state,
          requestReceived,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          requestReceived,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    case SEARCH_POLLS:
      if (action.payload.success) {
        return {
          ...state,
          searchResults: action.payload.polls
        };
      }

      if (action.payload.error) {
        return {
          ...state,
          error: action.payload.error
        };
      }
      if (action.payload.exception) {
        return {
          ...state,
          error: 'System error. Please try again later.'
        };
      }
      return state;
    default:
      return state;
  }
};

export default pollReducer;
