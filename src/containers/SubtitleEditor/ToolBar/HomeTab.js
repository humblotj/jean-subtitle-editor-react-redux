import React from "react";
import { connect } from "react-redux";
import { Box, Divider } from "@material-ui/core";
import {
  GetApp as GetAppIcon,
  AssignmentReturned as AssignmentReturnedIcon
} from "@material-ui/icons";
import * as JSZip from "jszip";
import * as FileSaver from "file-saver";

import * as actions from "../../../store/actions/index";
import * as SubtitleParser from "../../../Utils/SubtitleParser";
import { EventEmitter } from "../../../Utils/events";
import ButtonTextIcon from "../../../components/UI/ButtonTextIcon";
import InputCopy from "../../../components/UI/InputCopy";

class HomeTab extends React.Component {
  constructor() {
    super();

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
        <ButtonTextIcon
          icon={GetAppIcon}
          text={"Load Project"}
          clickHandler={this.loadProject}
          disabled={!this.state.projectKeyTmp}
        />
        <InputCopy
          placeholder={"Project Key"}
          value={this.state.projectKeyTmp}
          setValue={value => this.setState({ projectKeyTmp: value })}
        />
        <Divider orientation="vertical" style={{ marginRight: "8px" }} />
        <InputCopy
          placeholder={"Project Name"}
          value={this.props.projectName}
          setValue={this.props.setProjectName}
        />
        <Divider orientation="vertical" />
        <ButtonTextIcon
          icon={AssignmentReturnedIcon}
          text={"Download Project"}
          clickHandler={this.onDownloadProject}
          disabled={!this.props.timeStamp.length}
        />
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
    setProjectName: projectName => dispatch(actions.setProjectName(projectName))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeTab);
