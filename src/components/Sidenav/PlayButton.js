import React from "react";
import { IconButton } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from "@material-ui/icons";
import PropTypes from "prop-types";

export default function PlayButton(props) {
  return (
    <IconButton aria-label="play" size="small" onClick={props.play}>
      {props.paused ? (
        <PlayArrowIcon fontSize="inherit" />
      ) : (
        <PauseIcon fontSize="inherit" />
      )}
    </IconButton>
  );
}

PlayButton.propTypes = {
  play: PropTypes.func.isRequired,
  paused: PropTypes.bool.isRequired
};
