import React from "react";
import { connect } from "react-redux";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { grey, indigo } from "@material-ui/core/colors";
import qs, { parse } from "query-string";
import axios from "axios";
import * as xml2js from "xml2js";

import { databaseRef } from "../../firebase";
import * as actions from "../../store/actions/index";
import { EventEmitter } from "../../Utils/events";
import TabToolbar from "../../components/TabToolBar";
import HomeTab from "./ToolBar/HomeTab";
import VideoTab from "./ToolBar/VideoTab";
import SimpleSnackbar from "../../components/SimpleSnackBar";
import FixedDrawer from "../../components/FixedDrawer";
import Sidenav from "./Sidenav/Sidenav";
import Main from "./Main/Main";
import SubtitleTab from "./ToolBar/SubtitleTab";
import EditTab from "./ToolBar/EditTab";

const theme = createMuiTheme({
  palette: {
    primary: grey,
    secondary: indigo
  }
});

const bars = [
  { label: "Home", component: HomeTab },
  { label: "Video", component: VideoTab },
  { label: "Subtitle", component: SubtitleTab },
  { label: "Edit", component: EditTab }
];

class SubtitleEditor extends React.Component {
  componentDidMount() {
    const id = parse(this.props.location.search).id;
    if (id) {
      this.loadProject(id);
    }
    EventEmitter.subscribe("changeURL", this.changeURL);
    EventEmitter.subscribe("playYTLink", this.playYTLink);
    EventEmitter.subscribe("loadProject", this.loadProject);
  }

  componentWillUnmount() {
    EventEmitter.removeListener("changeURL", this.changeURL);
    EventEmitter.removeListener("playYTLink", this.playYTLink);
    EventEmitter.removeListener("loadProject", this.loadProject);
  }

  loadProject = id => {
    databaseRef
      .child("subtitles")
      .child(id)
      .on("value", snapshot => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          this.props.loadProject(
            id,
            data.projectName,
            data.timeStamp,
            data.script,
            data.scriptTranslation
          );
          if (data.videoId) {
            this.playYTLink(data.videoId);
            this.props.setYoutubeLink(
              "https://www.youtube.com/watch?v=" + data.videoId
            );
          }
        } else {
          this.props.openSnackbar("Wrong Project Key.");
        }
      });
  };

  changeURL = projectKey => {
    const id = parse(this.props.location.search).id;
    if (projectKey !== "" && projectKey !== id) {
      const query = { id: projectKey };

      const searchString = qs.stringify(query);
      this.props.history.push({
        search: searchString
      });
    }
  };

  playYTLink = videoId => {
    this.storeVideo(videoId, videoId)
      .then(response => {
        const downloadURL = response.data;
        if (this.props.url !== downloadURL) {
          this.props.videoSelected(videoId, "video/mp4", downloadURL);
          this.displaySubtitles(videoId);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  storeVideo = (videoId, name) => {
    const url =
      "https://us-central1-jean-subtitle-editor.cloudfunctions.net/youtubedl";
    return axios.post(url, null, {
      params: {
        id: videoId,
        name
      }
    });
  };

  displaySubtitles = videoId => {
    const url = "https://video.google.com/timedtext";
    axios
      .get(url, {
        params: {
          type: "list",
          v: videoId
        }
      })
      .then(result => this.parseXml(result.data));
  };

  parseXml = xmlStr => {
    const parser = new xml2js.Parser();
    parser.parseString(xmlStr, (err, result) => {
      let list = [];
      if (result.transcript_list.track) {
        list = result.transcript_list.track.map(item => ({
          name: item.$.name,
          lang_code: item.$.lang_code,
          lang_translated: item.$.lang_translated
        }));
      }
      this.props.setSubtitleList(list);
    });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <div style={{ display: "flex" }}>
          <TabToolbar bars={bars} openSnackBar={this.openSnackBar} />
          <FixedDrawer component={Sidenav} />
          <Main />
        </div>
        <SimpleSnackbar />
      </MuiThemeProvider>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    loadProject: (
      projectKey,
      projectName,
      timeStamp,
      script,
      scriptTranslation
    ) =>
      dispatch(
        actions.loadProject(
          projectKey,
          projectName,
          timeStamp,
          script,
          scriptTranslation
        )
      ),
    setYoutubeLink: youtubeLink =>
      dispatch(actions.setYoutubeLink(youtubeLink)),
    videoSelected: (videoId, videoType, url) =>
      dispatch(actions.videoSelected(videoId, videoType, url)),
    setSubtitleList: subtitleList =>
      dispatch(actions.setSubtitleList(subtitleList))
  };
};

export default connect(null, mapDispatchToProps)(SubtitleEditor);
