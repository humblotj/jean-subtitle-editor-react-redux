import React from "react";
import { connect } from "react-redux";
import { Button, Input, Box, Divider } from "@material-ui/core";
import { Timer as TimerIcon } from "@material-ui/icons";

import * as actions from "../../../store/actions/index";
import { EventEmitter } from "../../../Utils/events";
import RemoveLines from "../Main/Dialog/RemoveLines";
import ShiftTimes from "../Main/Dialog/ShiftTimes";

class EditTab extends React.Component {
  constructor() {
    super();

    this.state = {
      maxChar: 1000,
      openRemoveLines: false,
      openShiftTimes: false
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.timeStamp === nextProps.timeStamp &&
      this.state.maxChar === nextState.maxChar &&
      this.state.openRemoveLines === nextState.openRemoveLines &&
      this.state.openShiftTimes === nextState.openShiftTimes
    ) {
      return false;
    }
    return true;
  }

  removeMultipleLines = result => {
    this.setState({ openRemoveLines: false });
    const { timeStamp, script, scriptTranslation, preview } = this.props;
    if (result) {
      EventEmitter.dispatch("do", null);
      const begin = result.begin - 1 >= 0 ? result.begin - 1 : 0;
      const end =
        result.end - 1 <= timeStamp.length - 1
          ? result.end - 1
          : timeStamp.length - 1;

      timeStamp.splice(begin, end - begin + 1);
      script.splice(begin, end - begin + 1);
      scriptTranslation.splice(begin, end - begin + 1);
      preview.splice(begin, end - begin + 1);

      this.props.translationSelected(
        [...timeStamp],
        [...script],
        [...scriptTranslation],
        [...preview]
      );

      this.props.setIndexActive(timeStamp.length ? 0 : null);

      EventEmitter.dispatch("refreshRegion", null);
    }
  };

  removeEmptyLines = () => {
    EventEmitter.dispatch("do", null);
    const { timeStamp, script, scriptTranslation, preview } = this.props;
    let i = timeStamp.length;
    while (i--) {
      if (script[i] === "") {
        timeStamp.splice(i, 1);
        script.splice(i, 1);
        scriptTranslation.splice(i, 1);
        preview.splice(i, 1);
      }
    }
    this.props.translationSelected(
      [...timeStamp],
      [...script],
      [...scriptTranslation],
      [...preview]
    );
  };

  fixOverlapping = () => {
    EventEmitter.dispatch("do", null);
    const { timeStamp } = this.props;
    for (let i = 0; i < timeStamp.length - 1; i++) {
      if (timeStamp[i].endMs > timeStamp[i + 1].startMs) {
        timeStamp[i].endMs = timeStamp[i + 1].startMs;
      }
    }
    this.props.updateTimestamp([...timeStamp]);
  };

  mergeToSentences() {
    EventEmitter.dispatch("do", null);
    const {
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive
    } = this.props;
    let i = timeStamp.length;
    const regexEnd = /[^.?!)]$/g;
    // const regexBegin = /^[a-z]/g;
    while (i--) {
      if (i === 0) {
        break;
      }
      if (
        script[i - 1].match(
          regexEnd
        ) /*&& script[i].sentence.match(regexBegin)*/
      ) {
        const newScript = script[i - 1].trim() + " " + script[i].trim();
        if (newScript.length < this.state.maxCharSentence) {
          timeStamp[i - 1] = {
            startMs: timeStamp[i - 1].startMs,
            endMs: timeStamp[i].endMs
          };
          timeStamp.splice(i, 1);
          script[i - 1] = newScript;
          script.splice(i, 1);
          scriptTranslation[i - 1] =
            scriptTranslation[i - 1].trim() + " " + scriptTranslation[i].trim();
          scriptTranslation.splice(i, 1);
          preview[i - 1] = {
            en: preview[i - 1].en.trim() + " " + preview[i].en.trim(),
            ko: preview[i - 1].ko.trim() + " " + preview[i].ko.trim(),
            rpa: preview[i - 1].rpa.trim() + " " + preview[i].rpa.trim()
          };
          preview.splice(i, 1);
        }
      }
    }

    this.props.translationSelected(
      [...timeStamp],
      [...script],
      [...scriptTranslation],
      [...preview]
    );

    if (indexActive > timeStamp.length - 1) {
      this.props.setIndexActive(timeStamp.length - 1);
    }
  }

  shiftTimes = result => {
    this.setState({ openShiftTimes: false });
    const { timeStamp } = this.props;
    if (result) {
      EventEmitter.dispatch("do", null);

      if (result.forward === "backward") {
        const time = -result.time;
        for (let i = result.begin - 1; i <= result.end - 1; i++) {
          if (result.target === "start" || result.target === "both") {
            timeStamp[i].startMs += time;
            if (timeStamp[i].startMs < 0) {
              timeStamp[i].startMs = 0;
            }
          }
          if (result.target === "end" || result.target === "both") {
            timeStamp[i].endMs += time;
            if (timeStamp[i].endMs < 0) {
              timeStamp[i].endMs = 0;
            }
          }
        }
      } else {
        for (let i = result.begin - 1; i <= result.end - 1; i++) {
          if (result.target === "start" || result.target === "both") {
            timeStamp[i].startMs += result.time;
          }
          if (result.target === "end" || result.target === "both") {
            timeStamp[i].endMs += result.time;
          }
        }
      }
      this.props.updateTimestamp([...timeStamp]);

      EventEmitter.dispatch("refreshRegion", null);
    }
  };

  render() {
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{ height: "60px", width: "max-content" }}
      >
        <Button
          onClick={() => this.setState({ openRemoveLines: true })}
          disabled={!this.props.timeStamp.length}
        >
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
              {"Remove\nMultiple Lines"}
            </span>
          </Box>
        </Button>
        <RemoveLines
          length={this.props.timeStamp.length}
          open={this.state.openRemoveLines}
          onClose={this.removeMultipleLines}
        />
        <Divider orientation="vertical" />
        <Button
          onClick={this.removeEmptyLines}
          disabled={!this.props.timeStamp.length}
        >
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
              {"Remove\n Empty Lines"}
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
        <Button
          onClick={this.fixOverlapping}
          disabled={!this.props.timeStamp.length}
        >
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
              {"Fix Overlapping\nLines"}
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
        <Input
          type="number"
          value={this.state.maxChar}
          onChange={event =>
            this.setState({ maxChar: event.currentTarget.value })
          }
          style={{ width: "50px", marginLeft: "8px" }}
        />
        <Button
          onClick={this.mergeToSentences}
          disabled={!this.props.timeStamp.length}
        >
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
              {"Merge to\nsentences"}
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
        <Button
          onClick={() => this.setState({ openShiftTimes: true })}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <TimerIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Shift Times
            </span>
          </Box>
        </Button>
        <ShiftTimes
          length={this.props.timeStamp.length}
          open={this.state.openShiftTimes}
          onClose={this.shiftTimes}
        />
        <Divider orientation="vertical" />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    preview: state.subtitle.preview,
    indexActive: state.subtitle.indexActive
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateTimestamp: timeStamp => dispatch(actions.updateTimestamp(timeStamp)),
    translationSelected: (timeStamp, script, scriptTranslation, preview) =>
      dispatch(
        actions.translationSelected(
          timeStamp,
          script,
          scriptTranslation,
          preview
        )
      ),
    setIndexActive: indexActive => dispatch(actions.setIndexActive(indexActive))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTab);
