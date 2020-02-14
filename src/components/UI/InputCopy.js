import React from "react";
import { Input, IconButton } from "@material-ui/core";
import {
  Close as CloseIcon,
  FileCopy as FileCopyIcon
} from "@material-ui/icons";
import PropTypes from "prop-types";
import copy from "copy-to-clipboard";
import { useDispatch } from "react-redux";

import { openSnackbar } from "../../store/actions/snackbar";

export default function InputCopy(props) {
  const { placeholder, value, setValue } = props;

  const inputRef = React.useRef(null);

  const copyInput = () => {
    if (
      inputRef.current.children[0].value &&
      copy(inputRef.current.children[0].value)
    ) {
      copySuccess("Copied to clipboard.");
    }
  };

  const dispatch = useDispatch();
  const copySuccess = message => {
    dispatch(openSnackbar(message));
  };

  return (
    <React.Fragment>
      <form noValidate autoComplete="off">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={event => setValue(event.currentTarget.value)}
          ref={inputRef}
          endAdornment={
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => setValue("")}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        />
      </form>
      <IconButton
        aria-label="copy"
        size="small"
        onClick={copyInput}
        disabled={!value}
      >
        <FileCopyIcon />
      </IconButton>
    </React.Fragment>
  );
}

InputCopy.propTypes = {
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired
};
