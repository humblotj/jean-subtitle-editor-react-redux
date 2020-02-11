import React, { createRef } from "react";
import { connect } from "react-redux";
import { TextareaAutosize, Box, IconButton } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from "@material-ui/icons";
import MaskedInput from "react-text-mask";

import * as actions from "../../../../store/actions/index";
import * as SubtitleParser from "../../../../Utils/SubtitleParser";
import { EventEmitter } from "../../../../Utils/events";
import classes from "./ScriptLine.module.css";

class ScriptLine extends React.Component {
  constructor() {
    super();
    this.startInput = createRef();
    this.endInput = createRef();
    this.state = {
      startTime: "",
      endTime: ""
    };
  }

  componentDidMount() {
    const startTime = SubtitleParser.msToTime(
      this.props.timeStamp[this.props.index].startMs
    );
    const endTime = SubtitleParser.msToTime(
      this.props.timeStamp[this.props.index].endMs
    );
    this.setState({ startTime, endTime });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.index === nextProps.index &&
      this.props.index !== this.props.indexActive &&
      nextProps.index !== nextProps.indexActive &&
      this.props.script === nextProps.script &&
      this.props.scriptTranslation === nextProps.scriptTranslation &&
      this.props.paused === nextProps.paused &&
      this.props.timeStamp === nextProps.timeStamp &&
      this.state.startTime === nextState.startTime &&
      this.state.endTime === nextState.endTime
    ) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.timeStamp !== this.props.timeStamp) {
      const startTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].startMs
      );
      const endTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].endMs
      );
      this.setState({ startTime, endTime });
    }
  }

  scriptChanged = event => {
    const { index } = this.props;
    this.props.updateScript(index, event.currentTarget.value);
  };

  scriptTranslationChanged = event => {
    const { scriptTranslation, index } = this.props;
    scriptTranslation[index] = event.currentTarget.value;
    this.props.updateScriptTranslation([...scriptTranslation]);
  };

  startTimeChanged = event => {
    if (event.currentTarget.value.match(/^[0-5][0-9]:[0-5][0-9].[0-9]{2}/)) {
      const { timeStamp, index } = this.props;
      const startTime = SubtitleParser.timeToMs(event.currentTarget.value);
      timeStamp[index].startMs = startTime;
      this.props.updateTimestamp([...timeStamp]);
    } else {
      const startTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].startMs
      );
      this.setState({ startTime });
    }
  };

  endTimeChanged = event => {
    if (event.currentTarget.value.match(/^[0-5][0-9]:[0-5][0-9].[0-9]{2}/)) {
      const { timeStamp, index } = this.props;
      const endTime = SubtitleParser.timeToMs(event.currentTarget.value);
      timeStamp[index].endMs = endTime;
      this.props.updateTimestamp([...timeStamp]);
    } else {
      const endTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].endMs
      );
      this.setState({ endTime });
    }
  };

  onPlayRegion = () => {
    const time = this.props.timeStamp[this.props.index];
    this.playInterval(time.startMs / 1000, time.endMs / 1000);
  };

  playInterval = (start, end) => {
    const { wavesurfer, player, rate, timeout } = this.props;
    clearTimeout(timeout);
    if (this.onTimeUpdate) {
      this.props.player.off("timeupdate", this.onTimeUpdate);
      this.onTimeUpdate = null;
    }

    if (start < end - 0.5 && wavesurfer !== null) {
      if (player === null) {
        wavesurfer.seekAndCenter(start / wavesurfer.getDuration());
        wavesurfer.play(start, end);
        const newTimeout = setTimeout(() => {
          wavesurfer.seekAndCenter(end / wavesurfer.getDuration());
          wavesurfer.pause();
          this.props.setTimeout(null);
        }, ((end - start) * 1000) / rate);
        this.props.setTimeout(newTimeout);
      } else {
        wavesurfer.seekAndCenter(start / wavesurfer.getDuration());
        player.currentTime(start);

        player.play();
        wavesurfer.play(start, end);

        player.on(
          "timeupdate",
          (this.onTimeUpdate = e => {
            // current time is given in seconds
            if (player.currentTime() >= end) {
              player.pause();
              player.off("timeupdate", this.onTimeUpdate);
              this.props.setOnTimeUpdate(null);
            }
          })
        );
        const newTimeout = setTimeout(() => {
          wavesurfer.seekAndCenter(end / wavesurfer.getDuration());
          wavesurfer.pause();
          this.props.setTimeout(null);
        }, ((end - start) * 1000) / rate);

        this.props.setTimeout(newTimeout);
        this.props.setOnTimeUpdate(this.onTimeUpdate);
      }
    }
  };

  lineClick = () => {
    if (this.props.index !== this.props.indexActive) {
      if (this.props.wavesurfer) {
        EventEmitter.dispatch("indexActiveChange", this.props.index);
      } else {
        const {
          index,
          indexActive,
          timeStamp,
          script,
          scriptTranslation,
          preview,
          previousState
        } = this.props;

        if (previousState !== null && indexActive !== null) {
          const iTmp = indexActive;
          if (
            previousState.script === script[iTmp] &&
            previousState.scriptTranslation === scriptTranslation[iTmp] &&
            previousState.timeStamp.startMs === timeStamp[iTmp].startMs &&
            previousState.timeStamp.endMs === timeStamp[iTmp].endMs
          ) {
          } else {
            EventEmitter.dispatch("doBis", iTmp);
            // this.doBis(iTmp);
            console.log("do");
          }
        }

        this.props.setPreviousState({
          timeStamp: JSON.parse(JSON.stringify(timeStamp[index])),
          script: script[index],
          scriptTranslation: scriptTranslation[index],
          preview: JSON.parse(JSON.stringify(preview[index]))
        });

        this.props.setIndexActive(index);
      }
    }
  };

  render() {
    const {
      style,
      index,
      indexActive,
      script,
      scriptTranslation,
      paused
    } = this.props;
    const { startTime, endTime } = this.state;

    console.log(index);
    return (
      <Box
        style={style}
        className={
          index === indexActive
            ? classes.scriptContainer + " " + classes.active
            : classes.scriptContainer
        }
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="center"
        onClick={this.lineClick}
      >
        <Box
          style={{ marginTop: "8px" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <span style={{ fontSize: "small" }}>{index + 1}</span>
          <IconButton
            aria-label="play"
            size="small"
            onClick={this.onPlayRegion}
            disabled={this.props.index !== this.props.indexActive}
          >
            {paused || indexActive !== index ? (
              <PlayArrowIcon fontSize="inherit" />
            ) : (
              <PauseIcon fontSize="inherit" />
            )}
          </IconButton>
        </Box>
        <Box
          style={{ marginLeft: "12px" }}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <MaskedInput
            ref={this.startInput}
            mask={[/[0-5]/, /\d/, ":", /[0-5]/, /\d/, ".", /\d/, /\d/]}
            placeholderChar={"\u2000"}
            showMask
            className={classes.timeContainer}
            value={startTime}
            onBlur={this.startTimeChanged}
          />
          <MaskedInput
            ref={this.endInput}
            mask={[/[0-5]/, /\d/, ":", /[0-5]/, /\d/, ".", /\d/, /\d/]}
            placeholderChar={"\u2000"}
            showMask
            className={classes.timeContainer}
            value={endTime}
            onBlur={this.endTimeChanged}
          />
        </Box>
        <Box style={{ width: "100%" }} display="flex" flexDirection="column">
          <TextareaAutosize
            value={script[index]}
            onChange={this.scriptChanged}
            className={classes.textPreview}
            rowsMax={1}
          ></TextareaAutosize>
          <hr className={classes.underline} />
          <TextareaAutosize
            value={scriptTranslation[index]}
            onChange={this.scriptTranslationChanged}
            className={classes.textPreview}
            rowsMax={1}
          ></TextareaAutosize>
        </Box>
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    indexActive: state.subtitle.indexActive,
    paused: state.video.paused,
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    preview: state.subtitle.preview,
    wavesurfer: state.video.wavesurfer,
    player: state.video.player,
    rate: state.video.rate,
    timeout: state.video.timeout,
    previousState: state.subtitle.previousState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTimestamp: timeStamp => dispatch(actions.updateTimestamp(timeStamp)),
    updateScript: (index, value) =>
      dispatch(actions.updateScript(index, value)),
    updateScriptTranslation: (index, value) =>
      dispatch(actions.updateScriptTranslation(index, value)),
    setTimeout: timeout => dispatch(actions.setTimeout(timeout)),
    setOnTimeUpdate: onTimeUpdate =>
      dispatch(actions.setOnTimeUpdate(onTimeUpdate)),
    setIndexActive: indexActive =>
      dispatch(actions.setIndexActive(indexActive)),
    setPreviousState: previousState =>
      dispatch(actions.setPreviousState(previousState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScriptLine);
