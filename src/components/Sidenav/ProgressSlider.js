import React from "react";
import { Slider } from "@material-ui/core";
import PropTypes from "prop-types";

export default function ProgressSlider(props) {
  return (
    <Slider
      value={props.progress}
      onChange={props.seekTo}
      aria-labelledby="progress-slider"
      style={{ margin: "0 8px", width: "calc(100% - 16px)" }}
    />
  );
}

ProgressSlider.propTypes = {
  seekTo: PropTypes.func.isRequired,
  progress: PropTypes.number.isRequired
};
