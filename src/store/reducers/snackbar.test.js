import snackBarReducer, { initialState } from "./snackbar";
import * as actionTypes from "../actions/actionTypes";

describe("snack reducer", () => {
  it("should return the initial state", () => {
    expect(snackBarReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle OPEN_SNACKBAR", () => {
    expect(
      snackBarReducer(initialState, {
        type: actionTypes.OPEN_SNACKBAR,
        message: "message"
      })
    ).toEqual({
      open: true,
      message: "message"
    });
  });

  it("should handle CLOSE_SNACKBAR", () => {
    expect(
      snackBarReducer(initialState, {
        type: actionTypes.CLOSE_SNACKBAR
      })
    ).toEqual({
      open: false,
      message: ""
    });
  });
});
