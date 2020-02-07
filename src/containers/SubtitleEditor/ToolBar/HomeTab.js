import React from "react";
import { connect } from "react-redux";
import { Button, Input, Box, Divider, IconButton } from "@material-ui/core";
import {
  GetApp as GetAppIcon,
  Close as CloseIcon,
  FileCopy as FileCopyIcon,
  AssignmentReturned as AssignmentReturnedIcon
} from "@material-ui/icons";
import copy from "copy-to-clipboard";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

import * as actions from "../../../store/actions/index";
import * as SubtitleParser from "../../../Utils/SubtitleParser";
import { EventEmitter } from "../../../Utils/events";

class HomeTab extends React.Component {
  constructor() {
    super();

    this.videoInput = React.createRef();
    this.keyInput = React.createRef();
    this.nameInput = React.createRef();

    this.state = {
      projectKeyTmp: ""
    };
  }

  componentDidMount() {
    this.setState({ projectKeyTmp: this.props.projectKey });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.projectKeyTmp === nextState.projectKeyTmp &&
      this.props.projectKey === nextProps.projectKey &&
      this.props.projectName === nextProps.projectName &&
      this.props.timeStamp === nextProps.timeStamp
    ) {
      return false;
    }
    return true;
  }

  onDownloadProject = () => {
    const { timeStamp, script, scriptTranslation, projectName } = this.props;
    const zip = new JSZip();
    let dataJSON = timeStamp.map((line, index) => {
      return {
        id: index,
        start: line.startMs,
        end: line.endMs,
        text: script[index].replace(/\{(.*?)\}/gi, "").trim()
      };
    });
    let dataFile = SubtitleParser.build(dataJSON, "srt");
    zip.file(projectName.replace(/\.[^/.]+$/, "") + "_en.srt", dataFile);

    dataJSON = timeStamp.map((line, index) => {
      return {
        id: index,
        start: line.startMs,
        end: line.endMs,
        text: scriptTranslation[index].replace(/\{(.*?)\}/gi, "").trim()
      };
    });
    dataFile = SubtitleParser.build(dataJSON, "srt");
    zip.file(projectName.replace(/\.[^/.]+$/, "") + "_ko.srt", dataFile);

    zip.generateAsync({ type: "blob" }).then(content => {
      FileSaver.saveAs(content, projectName.replace(/\.[^/.]+$/, "") + ".zip");
    });
  };

  copyKey = () => {
    if (
      this.keyInput.current.children[0].value &&
      copy(this.keyInput.current.children[0].value)
    ) {
      this.props.openSnackbar("Copied to clipboard.");
    }
  };

  copyName = () => {
    if (
      this.nameInput.current.children[0].value &&
      copy(this.nameInput.current.children[0].value)
    ) {
      this.props.openSnackbar("Copied to clipboard.");
    }
  };

  loadProject = () => {
    EventEmitter.dispatch("loadProject", this.state.projectKeyTmp);
    EventEmitter.dispatch("changeURL", this.state.projectKeyTmp);
  };

  render() {
    return (
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        style={{ height: "60px", width: "max-content" }}
      >
        <Button onClick={this.loadProject} disabled={!this.state.projectKeyTmp}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <GetAppIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Load Project
            </span>
          </Box>
        </Button>
        <form noValidate autoComplete="off">
          <Input
            placeholder="Project Key"
            value={this.state.projectKeyTmp}
            onChange={event =>
              this.setState({ projectKeyTmp: event.currentTarget.value })
            }
            ref={this.keyInput}
            endAdornment={
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => this.setState({ projectKeyTmp: "" })}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          />
        </form>
        <IconButton
          aria-label="copy"
          size="small"
          onClick={this.copyKey}
          disabled={!this.state.projectKeyTmp}
        >
          <FileCopyIcon />
        </IconButton>
        <Divider orientation="vertical" />
        <form noValidate autoComplete="off" style={{ marginLeft: "8px" }}>
          <Input
            placeholder="Project Name"
            value={this.props.projectName}
            onChange={event =>
              this.props.setProjectName(event.currentTarget.value)
            }
            ref={this.nameInput}
            endAdornment={
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => this.props.setProjectName("")}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          />
        </form>
        <IconButton
          aria-label="copy"
          size="small"
          onClick={this.copyName}
          disabled={!this.props.projectName}
        >
          <FileCopyIcon />
        </IconButton>
        <Divider orientation="vertical" />
        <Button
          onClick={() => this.downloadProject}
          disabled={!this.props.timeStamp.length}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <AssignmentReturnedIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Download Project
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    projectKey: state.subtitle.projectKey,
    projectName: state.subtitle.projectName,
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoId, videoType, url) =>
      dispatch(actions.videoSelected(videoId, videoType, url)),
    setSubtitleList: subtitleList =>
      dispatch(actions.setSubtitleList(subtitleList)),
    setProjectName: projectName => dispatch(actions.setProjectName(projectName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
