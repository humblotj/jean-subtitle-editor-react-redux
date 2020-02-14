import React from "react";
import { Button, Box } from "@material-ui/core";
import PropTypes from "prop-types";

const ButtonTextIcon = React.forwardRef((props, ref) => {
  const { clickHandler, disabled, text } = props;

  return (
    <Button onClick={clickHandler} disabled={disabled} ref={ref}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <props.icon />
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
});

export default ButtonTextIcon;

ButtonTextIcon.propTypes = {
  clickHandler: PropTypes.func.isRequired,
  icon: PropTypes.any.isRequired,
  text: PropTypes.string.isRequired
};
