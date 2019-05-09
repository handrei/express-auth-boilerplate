import axios from 'axios';
import jwt_decode from 'jwt-decode';

import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/auth/signup', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//login get-user token
export const loginUser = userData => dispatch => {
  axios
    .post('/api/auth/login', userData)
    .then(res => {
      //save to localstorage
      const { token } = res.data;
      // set token to localstorage
      localStorage.setItem('jwtToken', token);
      //set token to auth header
      setAuthToken(token);
      // decode token to get user data
      const decoded = jwt_decode(token);
      // set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//log user out
export const logoutUser = () => dispatch => {
  // remove the token from localStorage
  localStorage.removeItem('jwtToken');
  // remove auth header for future request
  setAuthToken(false);
  // set the current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

//set current user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
