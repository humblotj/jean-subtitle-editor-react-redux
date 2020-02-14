import React from "react";
import { connect } from "react-redux";
import { Box, Divider } from "@material-ui/core";
import {
  Redo as RedoIcon,
  Undo as UndoIcon,
  Save as SaveIcon
} from "@material-ui/icons";

import * as actions from "../../../store/actions/index";
import { EventEmitter } from "../../../Utils/events";
import { databaseRef } from "../../../firebase";
import ButtonTextIcon from "../../../components/UI/ButtonTextIcon";

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

    EventEmitter.subscribe("do", this.do);
    EventEmitter.subscribe("doBis", this.doBis);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.showUndo === nextState.showUndo &&
      this.state.showRedo === nextState.showRedo &&
      this.props.timeStamp === nextProps.timeStamp
    ) {
      return false;
    }
    return true;
  }

  componentWillUnmount() {
    EventEmitter.removeListener("do", this.do);
    EventEmitter.removeListener("doBis", this.doBis);
  }

  do = () => {
    this.dataRedoArray = [];

    if (this.dataUndoArray.length === this.undoLimit) {
      this.dataUndoArray.reverse().pop();
      this.dataUndoArray.reverse();
    }

    const { timeStamp, script, scriptTranslation, preview } = this.props;

    this.dataUndoArray.push({
      timeStamp: JSON.parse(JSON.stringify(timeStamp)),
      script: script.slice(),
      scriptTranslation: scriptTranslation.slice(),
      preview: JSON.parse(JSON.stringify(preview))
    });
    this.setState({ showUndo: true, showRedo: false });
  };

  doBis = index => {
    this.dataRedoArray = [];

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
    this.setState({ showUndo: true, showRedo: false });
  };

  undo = () => {
    if (this.dataUndoArray.length !== 0) {
      const { timeStamp, script, scriptTranslation, preview } = this.props;

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
        this.setState({ showUndo: false, showRedo: true });
      } else {
        this.setState({ showRedo: true });
      }

      EventEmitter.dispatch("refreshRegion", null);
    }
  };

  redo = () => {
    if (this.dataRedoArray.length !== 0) {
      const { timeStamp, script, scriptTranslation, preview } = this.props;

      this.dataUndoArray.push({
        timeStamp: JSON.parse(JSON.stringify(timeStamp)),
        script: script.slice(),
        scriptTranslation: scriptTranslation.slice(),
        preview: JSON.parse(JSON.stringify(preview))
      });

      const currentData = this.dataRedoArray.pop();
      this.props.translationSelected(
        currentData.timeStamp,
        currentData.script,
        currentData.scriptTranslation,
        currentData.preview
      );

      if (this.dataRedoArray.length === 0) {
        this.setState({ showRedo: false });
      }
    }

    if (this.dataUndoArray.length > 0) {
      this.setState({ showUndo: true });
    } else {
      this.setState({ showUndo: false });
    }

    EventEmitter.dispatch("refreshRegion", null);
  };

  saveProject = () => {
    try {
      this.storeData();
      this.lastSaveDate = new Date();
      console.log("Project Saved");
    } catch (error) {
      console.error(error);
      console.log("Save Failed");
    }
  };

  storeData = () => {
    const {
      projectKey,
      videoId,
      projectName,
      timeStamp,
      script,
      scriptTranslation
    } = this.props;

    const data = {
      videoId,
      projectName,
      timeStamp,
      script,
      scriptTranslation
    };

    if (projectKey === "") {
      const id = databaseRef
        .child("subtitles")
        .push(data)
        .getKey();
      this.props.setProjectKey(id);
      this.changeURL(id);
    } else {
      databaseRef
        .child("subtitles")
        .child(projectKey)
        .set(data);
      this.changeURL(projectKey);
    }
  };

  changeURL = projectKey => {
    EventEmitter.dispatch("changeURL", projectKey);
  };

  render() {
    const { showUndo, showRedo } = this.state;
    return (
      <Box display="flex" flexDirection="row" style={{ height: "60px" }}>
        <Divider orientation="vertical" />
        <ButtonTextIcon
          icon={SaveIcon}
          text={"Save Project"}
          clickHandler={this.saveProject}
          disabled={!this.props.timeStamp.length}
        />
        <Divider orientation="vertical" />
        <ButtonTextIcon
          icon={UndoIcon}
          text={"Undo"}
          clickHandler={this.undo}
          disabled={!showUndo}
        />
        <Divider orientation="vertical" />
        <ButtonTextIcon
          icon={RedoIcon}
          text={"Redo"}
          clickHandler={this.redo}
          disabled={!showRedo}
        />
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
    previousState: state.subtitle.previousState,
    projectKey: state.subtitle.projectKey,
    projectName: state.subtitle.projectName,
    videoId: state.video.videoId,
    indexActive: state.subtitle.indexActive
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
      ),
    setProjectKey: projectKey => dispatch(actions.setProjectKey(projectKey)),
    setIndexActive: indexActive => dispatch(actions.setIndexActive(indexActive))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CommonTab);
