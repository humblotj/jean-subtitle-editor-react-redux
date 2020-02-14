import React from "react";
import { IconButton, Slider } from "@material-ui/core";
import {
  VolumeMute as VolumeMuteIcon,
  VolumeDown as VolumeDownIcon,
  VolumeUp as VolumeUpIcon
} from "@material-ui/icons";
import PropTypes from "prop-types";

export default function AudioVolumeSlider(props) {
  return (
    <div style={{ display: "flex" }}>
      <IconButton
        aria-label="volume"
        size="small"
        onClick={props.toggleMute}
        style={{ marginRight: "8px" }}
      >
        {props.audioVolume === 0 ? (
          <VolumeMuteIcon fontSize="inherit" />
        ) : props.audioVolume > 0.25 ? (
          <VolumeUpIcon fontSize="inherit" />
        ) : (
          <VolumeDownIcon fontSize="inherit" />
        )}
      </IconButton>
      <Slider
        value={props.audioVolume}
        onChange={(event, value) => {
          props.setVolume(value);
        }}
        min={0}
        step={0.05}
        max={0.5}
        aria-labelledby="audio-slider"
        style={{ width: "59px" }}
      />
    </div>
  );
}

AudioVolumeSlider.propTypes = {
  setVolume: PropTypes.func.isRequired,
  toggleMute: PropTypes.func.isRequired,
  audioVolume: PropTypes.number.isRequired
};
