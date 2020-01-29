import React from "react";
import { connect } from "react-redux";
import { IconButton, Box, Slider } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  VolumeMute as VolumeMuteIcon,
  VolumeDown as VolumeDownIcon,
  VolumeUp as VolumeUpIcon
} from "@material-ui/icons";

import * as actions from "../../../store/actions/index";

class PlayerControls extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.player === nextProps.player &&
      this.props.progress === nextProps.progress &&
      this.props.currentTime === nextProps.currentTime &&
      this.props.duration === nextProps.duration &&
      this.props.paused === nextProps.paused &&
      this.props.audioVolume === nextProps.audioVolume
    ) {
      return false;
    }
    return true;
  }

  seekTo = (event, progress) => {
    if (progress >= 0 && progress <= 100) {
      this.props.setProgress("", progress);
      if (this.props.player) {
        const time = (this.props.player.duration() * progress) / 100;
        this.props.player.currentTime(time);
      }
      if (this.props.wavesurfer) {
        this.props.wavesurfer.seekAndCenter(progress / 100);
      }
    }
  };

  play = () => {
    clearTimeout(this.props.timeout);
    this.props.setTimeout(null);

    if (this.props.player) {
      if (this.props.onTimeUpdate) {
        this.props.player.off("timeupdate", this.props.onTimeUpdate);
        this.props.setOnTimeUpdate(null);
      }
    }

    if (this.props.paused) {
      if (this.props.player) {
        this.props.player.play();
      }
      if (this.props.wavesurfer) {
        this.props.wavesurfer.play();
      }
    } else {
      if (this.props.player) {
        this.props.player.pause();
      }
      if (this.props.wavesurfer) {
        this.props.wavesurfer.pause();
      }
    }
  };

  toggleMute = () => {
    const { audioVolume } = this.props;
    if (audioVolume) {
      this.oldVolume = audioVolume;
      this.props.setVolume(0);
      this.props.wavesurfer.setVolume(0);
    } else {
      if (!this.oldVolume) {
        this.oldVolume = 0.25;
      }
      this.props.setVolume(this.oldVolume);
      this.props.wavesurfer.setVolume(this.oldVolume);
    }
  };

  render() {
    let { progress, paused, currentTime, duration, audioVolume } = this.props;

    return (
      <div>
        <Slider
          value={progress}
          onChange={this.seekTo}
          aria-labelledby="progress-slider"
          style={{ margin: "0 8px", width: "calc(100% - 16px)" }}
        />
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          style={{ marginRight: "8px" }}
        >
          <div>
            <IconButton aria-label="play" size="small" onClick={this.play}>
              {paused ? (
                <PlayArrowIcon fontSize="inherit" />
              ) : (
                <PauseIcon fontSize="inherit" />
              )}
            </IconButton>
            <span style={{ fontSize: "12px", marginTop: "5px" }}>
              {currentTime}/{duration}
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <IconButton
              aria-label="volume"
              size="small"
              onClick={this.toggleMute}
              style={{ marginRight: "8px" }}
            >
              {audioVolume === 0 ? (
                <VolumeMuteIcon fontSize="inherit" />
              ) : audioVolume > 0.25 ? (
                <VolumeUpIcon fontSize="inherit" />
              ) : (
                <VolumeDownIcon fontSize="inherit" />
              )}
            </IconButton>
            <Slider
              value={audioVolume}
              onChange={(event, value) => {
                this.props.wavesurfer.setVolume(value);
                this.props.setVolume(value);
              }}
              min={0}
              step={0.05}
              max={0.5}
              aria-labelledby="audio-slider"
              style={{ width: "59px" }}
            />
          </div>
        </Box>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.video.player,
    wavesurfer: state.video.wavesurfer,
    progress: state.video.progress,
    currentTime: state.video.currentTime,
    duration: state.video.duration,
    paused: state.video.paused,
    audioVolume: state.video.audioVolume,
    timeout: state.video.timeout,
    onTimeUpdate: state.video.onTimeUpdate
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setProgress: (currentTime, progress) =>
      dispatch(actions.setProgress(currentTime, progress)),
    setVolume: audioVolume => dispatch(actions.setVolume(audioVolume)),
    setTimeout: timeout => dispatch(actions.setTimeout(timeout)),
    setOnTimeUpdate: onTimeUpdate =>
      dispatch(actions.setOnTimeUpdate(onTimeUpdate))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerControls);
