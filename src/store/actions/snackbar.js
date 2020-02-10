import * as actionTypes from "./actionTypes";

export const openSnackbar = message => {
  return dispatch => {
    dispatch({ type: actionTypes.OPEN_SNACKBAR, message });
  };
};

export const closeSnackbar = () => {
  return dispatch => {
    dispatch({ type: actionTypes.CLOSE_SNACKBAR });
  };
};
