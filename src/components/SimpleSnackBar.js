import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import { useDispatch, useSelector } from "react-redux";

import { closeSnackbar } from "../store/actions/snackbar";

export default function SimpleSnackbar() {
  const dispatch = useDispatch();

  const { message, open } = useSelector(state => state.snackBar);

  const handleClose = (event, reason) => {
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
      }}
      open={open}
      onClose={handleClose}
      autoHideDuration={2000}
      message={message}
    />
  );
}
