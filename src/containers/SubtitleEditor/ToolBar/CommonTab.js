import React from "react";
import { connect } from "react-redux";
import { Button, Box, Divider } from "@material-ui/core";
import { Redo as RedoIcon, Undo as UndoIcon } from "@material-ui/icons";

import * as actions from "../../../store/actions/index";
import { EventEmitter } from "../../../Utils/events";

class CommonTab extends React.Component {
  constructor() {
    super();

    this.dataUndoArray = [];
    this.dataRedoArray = [];
    this.undoLimit = 5;

    this.state = {
      showUndo: false,
      showRedo: false
    };

    EventEmitter.subscribe("do", () => {
      this.do();
    });

    EventEmitter.subscribe("doBis", index => {
      this.doBis(index);
    });
  }
  //   shouldComponentUpdate(nextProps, nextState) {
  //   }

  do = () => {
    this.dataRedoArray = [];
    // this.showRedo = false;

    if (this.dataUndoArray.length === this.undoLimit) {
      this.dataUndoArray.reverse().pop();
      this.dataUndoArray.reverse();
    }
    // this.dataUndoArray.push({
    //   timeStamp: JSON.parse(JSON.stringify(this.timeStamp)),
    //   script: this.script.slice(),
    //   scriptTranslation: this.scriptTranslation.slice(),
    //   preview: this.preview ? JSON.parse(JSON.stringify(this.preview)) : []
    // });
    const { timeStamp, script, scriptTranslation, preview } = this.props;
    // this.dataUndoArray.push({
    //   timeStamp,
    //   script,
    //   scriptTranslation,
    //   preview
    // });
    this.dataUndoArray.push({
      timeStamp: JSON.parse(JSON.stringify(timeStamp)),
      script: script.slice(),
      scriptTranslation: scriptTranslation.slice(),
      preview: JSON.parse(JSON.stringify(preview))
    });
    // this.showUndo = true;
    this.setState({ showUndo: true, showRedo: false });
  };

  doBis = index => {
    this.dataRedoArray = [];
    // this.showRedo = false;

    if (this.dataUndoArray.length === this.undoLimit) {
      this.dataUndoArray.reverse().pop();
      this.dataUndoArray.reverse();
    }
    const timeStamp = JSON.parse(JSON.stringify(this.props.timeStamp));
    timeStamp[index].startMs = this.props.previousState.timeStamp.startMs;
    timeStamp[index].endMs = this.props.previousState.timeStamp.endMs;
    const script = this.props.script.slice();
    script[index] = this.props.previousState.script;
    const scriptTranslation = this.props.scriptTranslation.slice();
    scriptTranslation[index] = this.props.previousState.scriptTranslation;
    const preview = this.props.preview
      ? JSON.parse(JSON.stringify(this.props.preview))
      : [];
    if (preview.length !== 0) {
      preview[index].en = this.props.previousState.preview.en;
      preview[index].ko = this.props.previousState.preview.ko;
      preview[index].rpa = this.props.previousState.preview.rpa;
    }

    this.dataUndoArray.push({
      timeStamp,
      script,
      scriptTranslation,
      preview: this.props.preview
        ? JSON.parse(JSON.stringify(this.props.preview))
        : []
    });
    // this.showUndo = true;
    this.setState({ showUndo: true, showRedo: false });
  };

  undo = () => {
    // this.showRedo = true;
    if (this.dataUndoArray.length !== 0) {
      //   this.dataRedoArray.push({
      //     timeStamp: JSON.parse(JSON.stringify(this.timeStamp)),
      //     script: this.script.slice(),
      //     scriptTranslation: this.scriptTranslation.slice(),
      //     preview: this.preview ? JSON.parse(JSON.stringify(this.preview)) : []
      //   });
      const { timeStamp, script, scriptTranslation, preview } = this.props;
      //   this.dataRedoArray.push({
      //     timeStamp,
      //     script,
      //     scriptTranslation,
      //     preview
      //   });
      this.dataRedoArray.push({
        timeStamp: JSON.parse(JSON.stringify(timeStamp)),
        script: script.slice(),
        scriptTranslation: scriptTranslation.slice(),
        preview: JSON.parse(JSON.stringify(preview))
      });
      const currentData = this.dataUndoArray.pop();
      this.props.translationSelected(
        currentData.timeStamp,
        currentData.script,
        currentData.scriptTranslation,
        currentData.preview
      );

      if (this.dataUndoArray.length === 0) {
        // this.showUndo = false;
        this.setState({ showUndo: false, showRedo: true });
      } else {
        this.setState({ showRedo: true });
      }
      //   if (this.indexActive > this.timeStamp.length - 1) {
      //     this.indexActive = this.timeStamp.length
      //       ? this.timeStamp.length - 1
      //       : null;
      //   }
      //   this.loadRegions();
    }
  };

  redo = () => {
    if (this.dataRedoArray.length !== 0) {
      //   this.dataUndoArray.push({
      //     timeStamp: JSON.parse(JSON.stringify(this.timeStamp)),
      //     script: this.script.slice(),
      //     scriptTranslation: this.scriptTranslation.slice(),
      //     preview: JSON.parse(JSON.stringify(this.preview))
      //   });
      const { timeStamp, script, scriptTranslation, preview } = this.props;
      //   this.dataUndoArray.push({
      //     timeStamp,
      //     script,
      //     scriptTranslation,
      //     preview
      //   });
      this.dataUndoArray.push({
        timeStamp: JSON.parse(JSON.stringify(timeStamp)),
        script: script.slice(),
        scriptTranslation: scriptTranslation.slice(),
        preview: JSON.parse(JSON.stringify(preview))
      });
      //   const currentData = this.dataRedoArray.pop();
      //   this.timeStamp = currentData.timeStamp;
      //   this.script = currentData.script;
      //   this.scriptTranslation = currentData.scriptTranslation;
      //   this.preview = currentData.preview;
      const currentData = this.dataRedoArray.pop();
      this.props.translationSelected(
        currentData.timeStamp,
        currentData.script,
        currentData.scriptTranslation,
        currentData.preview
      );

      if (this.dataRedoArray.length === 0) {
        // this.showRedo = false;
        this.setState({ showRedo: false });
      }
      //   if (this.indexActive > this.timeStamp.length - 1) {
      //     this.indexActive = this.timeStamp.length
      //       ? this.timeStamp.length - 1
      //       : null;
      //   }
    }

    if (this.dataUndoArray.length > 0) {
      this.setState({ showUndo: true });
    } else {
      this.setState({ showUndo: false });
    }
    // this.loadRegions();
  };

  render() {
    const { showUndo, showRedo } = this.state;
    return (
      <Box display="flex" flexDirection="row" style={{ height: "60px" }}>
        <Divider orientation="vertical" />
        <Button onClick={this.undo} disabled={!showUndo}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <UndoIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Undo
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
        <Button onClick={this.redo} disabled={!showRedo}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <RedoIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Redo
            </span>
          </Box>
        </Button>
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
    previousState: state.subtitle.previousState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    translationSelected: (timeStamp, script, scriptTranslation, preview) =>
      dispatch(
        actions.translationSelected(
          timeStamp,
          script,
          scriptTranslation,
          preview
        )
      )
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonTab);
