import React from "react";
import { Button, Box } from "@material-ui/core";
import PropTypes from "prop-types";

export default function ButtonText(props) {
  const { clickHandler, disabled, text } = props;

  return (
    <Button onClick={clickHandler} disabled={disabled}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        style={{ whiteSpace: "pre-wrap" }}
      >
        <span
          style={{
            letterSpacing: "-0.5px",
            textTransform: "initial"
          }}
        >
          {text}
        </span>
      </Box>
    </Button>
  );
}

ButtonText.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};
