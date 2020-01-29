export const openSnackbar = message => {
  return dispatch => {
    dispatch({ type: "OPEN_SNACKBAR", message });
  };
};

export const closeSnackbar = () => {
  return dispatch => {
    dispatch({ type: "CLOSE_SNACKBAR" });
  };
};
