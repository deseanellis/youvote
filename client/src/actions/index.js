import axios from 'axios';
import Hashids from 'hashids';
import { reset } from 'redux-form';
import {
  GET_USER,
  REGISTER_USER,
  LOGIN_USER,
  CREATE_POLL,
  EDIT_POLL,
  GET_POLL,
  REG_VOTE,
  GET_ALL_POLLS,
  ADD_TO_POLL_LIST,
  DELETE_POLLS,
  CHANGE_PASSWORD,
  FORGOT_PASSWORD,
  GET_EDIT_POLL,
  SEARCH_POLLS
} from './types';

export const searchPolls = keywords => async dispatch => {
  var payload = {};
  try {
    const res = await axios.get(`/api/poll/search?keywords=${keywords}`);
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: SEARCH_POLLS, payload });
};

export const getEditPoll = id => async dispatch => {
  var hashids = new Hashids(process.env.REACT_APP_HASHIDS_KEY);
  var decodedId = hashids.decodeHex(id);
  var payload = {};
  try {
    const res = await axios.get(`/api/poll/single/${decodedId}`);
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: GET_EDIT_POLL, payload });
};

export const changePassword = (
  oldpass,
  newpass,
  tokenClear,
  email
) => async dispatch => {
  var payload = {};
  try {
    var res = await axios.post('/api/user/update/password', {
      oldpass,
      newpass,
      tokenClear,
      email
    });
    payload = res.data;
    if (payload.success) {
      dispatch(reset('changePasswordForm'));
    }
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: CHANGE_PASSWORD, payload });
};

export const forgotPassword = email => async dispatch => {
  var payload = {};
  try {
    var res = await axios.post('/api/resetpassword', { email });
    payload = res.data;
    if (payload.success) {
      dispatch(reset('forgotPasswordForm'));
    }
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: FORGOT_PASSWORD, payload });
};

export const deletePolls = polls => async dispatch => {
  var payload = {};
  try {
    var res = await axios.post('/api/poll/delete', { toDelete: polls });
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: DELETE_POLLS, payload });
};

export const addToPollList = id => dispatch => {
  dispatch({ type: ADD_TO_POLL_LIST, payload: id });
};

export const getAllPolls = (all, config) => async dispatch => {
  var payload = {};
  try {
    let uri = `/api/poll/?all=${all ? 1 : 0}`;
    if (config) {
      if (config.limit) {
        uri += `&limit=${config.limit}`;
      }

      if (config.field) {
        uri += `&field=${config.field}`;
      }

      if (config.sorted) {
        uri += `&sorted=${config.sorted}`;
      }
    }
    var res = await axios.get(uri);
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: GET_ALL_POLLS, payload });
};

export const getPollsVotedOn = () => async dispatch => {
  var payload = {};
  try {
    var res = await axios.get('/api/poll/voted');
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: GET_ALL_POLLS, payload });
};

export const regVote = (id, option) => async dispatch => {
  var hashids = new Hashids(process.env.REACT_APP_HASHIDS_KEY);
  var decodedId = hashids.decodeHex(id);

  var payload = {};
  try {
    var res = await axios.post(`/api/poll/${decodedId}/${option}`);
    if (res.data.success) {
      //Get New Poll Information
      res = await axios.get(`/api/poll/single/${decodedId}`);
    }
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: REG_VOTE, payload });
};

export const getPoll = id => async dispatch => {
  var hashids = new Hashids(process.env.REACT_APP_HASHIDS_KEY);
  var decodedId = hashids.decodeHex(id);
  var payload = {};
  try {
    const res = await axios.get(`/api/poll/single/${decodedId}`);
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: GET_POLL, payload });
};

export const editPoll = (id, options, isPrivate) => async dispatch => {
  var payload = {};
  try {
    const res = await axios.post(`/api/poll/update/${id}`, {
      options,
      isPrivate
    });
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }
  dispatch({ type: EDIT_POLL, payload });
};

export const createPoll = values => async dispatch => {
  var payload = {};
  try {
    const res = await axios.post('/api/poll', values);
    if (res.data.success) {
      dispatch(reset('createPollForm'));
    }
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }
  dispatch({ type: CREATE_POLL, payload });
};

export const getUser = () => async dispatch => {
  var payload = {};
  try {
    //Send request to get user information
    const res = await axios.get('/api/user');
    payload = res.data;
  } catch (e) {
    payload = { success: false, error: e };
  }
  dispatch({ type: GET_USER, payload });
};

export const loginUser = (user, history) => async dispatch => {
  var payload = {};
  try {
    //Send request to login user
    const res = await axios.post('/api/login', user);
    payload = res.data;

    //Push User to Dashboard if successful
    if (res.data.success) {
      history.push('/');
    }
  } catch (e) {
    payload = { success: false, error: e };
  }

  dispatch({ type: LOGIN_USER, payload });
};

export const registerUser = (values, history) => async dispatch => {
  var payload = {};

  try {
    //Send request to regiser user
    const user = await axios.post('/api/register', values);
    if (user.data.success) {
      //Registration was successful, so send e-mail to user for validation
      const mail = await axios.post('/api/initialsend', {
        email: user.data.email
      });
      if (mail.data.success) {
        payload = { success: true, email: user.data.email };
        dispatch(reset('registrationForm'));
      } else {
        payload = mail.data;
      }
    } else {
      payload = user.data;
    }
  } catch (e) {
    payload = { success: false, error: e };
  }
  dispatch({ type: REGISTER_USER, payload });
};
