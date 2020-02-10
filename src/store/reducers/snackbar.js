import * as actionTypes from '../actions/actionTypes';

export const initialState = {
  open: false,
  message: ""
};

const snackBarReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_SNACKBAR:
      return {
        ...state,
        open: true,
        message: action.message
      };
    case actionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        open: false,
        message: ""
      };
    default:
      return state;
  }
};

export default snackBarReducer;
