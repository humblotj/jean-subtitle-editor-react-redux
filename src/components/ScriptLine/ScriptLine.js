import React from "react";
import { TextareaAutosize, Box, IconButton } from "@material-ui/core";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from "@material-ui/icons";
import MaskedInput from "react-text-mask";

import * as SubtitleParser from "../../Utils/SubtitleParser";
import classes from "./ScriptLine.module.css";

class ScriptLine extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (
      this.props.index === nextProps.index &&
      ((this.props.index !== this.props.indexActive &&
        nextProps.index !== nextProps.indexActive) ||
        this.props.indexActive === nextProps.indexActive) &&
      this.props.scriptValue === nextProps.scriptValue &&
      this.props.scriptTranslationValue === nextProps.scriptTranslationValue &&
      (this.props.paused === nextProps.paused ||
        (this.props.paused !== nextProps.paused &&
          nextProps.index !== nextProps.indexActive)) &&
      this.props.startMs === nextProps.startMs &&
      this.props.endMs === nextProps.endMs
    ) {
      return false;
    }
    return true;
  }

  render() {
    const {
      style,
      index,
      indexActive,
      startMs,
      endMs,
      scriptValue,
      scriptTranslationValue,
      paused,
      scriptChanged,
      scriptTranslationChanged,
      startTimeChanged,
      endTimeChanged,
      playRegion,
      lineClick
    } = this.props;

    const startTime = SubtitleParser.msToTime(startMs);
    const endTime = SubtitleParser.msToTime(endMs);

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
        onClick={() => lineClick(index)}
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
            onClick={() => playRegion(index)}
            disabled={index !== indexActive}
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
            mask={[/[0-5]/, /\d/, ":", /[0-5]/, /\d/, ".", /\d/, /\d/]}
            placeholderChar={"\u2000"}
            showMask
            className={classes.timeContainer}
            value={startTime}
            onBlur={startTimeChanged}
          />
          <MaskedInput
            mask={[/[0-5]/, /\d/, ":", /[0-5]/, /\d/, ".", /\d/, /\d/]}
            placeholderChar={"\u2000"}
            showMask
            className={classes.timeContainer}
            value={endTime}
            onBlur={endTimeChanged}
          />
        </Box>
        <Box style={{ width: "100%" }} display="flex" flexDirection="column">
          <TextareaAutosize
            value={scriptValue}
            onChange={scriptChanged}
            className={classes.textPreview}
            rowsMax={1}
          ></TextareaAutosize>
          <hr className={classes.underline} />
          <TextareaAutosize
            value={scriptTranslationValue}
            onChange={scriptTranslationChanged}
            className={classes.textPreview}
            rowsMax={1}
          ></TextareaAutosize>
        </Box>
      </Box>
    );
  }
}

export default ScriptLine;
