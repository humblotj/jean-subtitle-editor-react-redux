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
    const { timeStamp } = this.props;
    if (result) {
      EventEmitter.dispatch("do", null);
      const begin = result.begin - 1 >= 0 ? result.begin - 1 : 0;
      const end =
        result.end - 1 <= timeStamp.length - 1
          ? result.end - 1
          : timeStamp.length - 1;

      this.props.removeLines(begin, end);
      EventEmitter.dispatch("refreshRegion", null);
    }
  };

  removeEmptyLines = () => {
    EventEmitter.dispatch("do", null);
    this.props.removeEmptyLines();
    EventEmitter.dispatch("refreshRegion", null);
  };

  fixOverlapping = () => {
    EventEmitter.dispatch("do", null);
    this.props.fixOverlapping();
    EventEmitter.dispatch("refreshRegion", null);
  };

  mergeToSentences = () => {
    EventEmitter.dispatch("do", null);
    this.props.mergeToSentences(this.state.maxChar);
    EventEmitter.dispatch("refreshRegion", null);
  };

  shiftTimes = result => {
    this.setState({ openShiftTimes: false });
    if (result) {
      EventEmitter.dispatch("do", null);

      this.props.shiftTimes(
        result.forward,
        result.target,
        result.begin,
        result.end,
        result.time
      );

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
    shiftTimes: (forward, target, begin, end, time) =>
      dispatch(actions.shiftTimes(forward, target, begin, end, time)),
    removeLines: (begin, end) => dispatch(actions.removeLines(begin, end)),
    removeEmptyLines: () => dispatch(actions.removeEmptyLines()),
    fixOverlapping: () => dispatch(actions.fixOverlapping()),
    mergeToSentences: maxChar =>
      dispatch(actions.mergeToSentences(maxChar)),
    setIndexActive: indexActive => dispatch(actions.setIndexActive(indexActive))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTab);
