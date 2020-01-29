const initialState = {
  open: false,
  message: ""
};

const snackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_SNACKBAR":
      return {
        ...state,
        open: true,
        message: action.message
      };
    case "CLOSE_SNACKBAR":
      return {
        ...state,
        open: false,
        message: action.message
      };
    default:
      return state;
  }
};

export default snackBarReducer;
