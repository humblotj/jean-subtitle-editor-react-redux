import React from "react";
import { connect } from "react-redux";
import { Button, Input, Box, Divider, IconButton } from "@material-ui/core";
import {
  VideoCall as VideoCallIcon,
  YouTube as YouTubeIcon,
  Close as CloseIcon,
  FileCopy as FileCopyIcon
} from "@material-ui/icons";
import copy from "copy-to-clipboard";
import axios from "axios";
import * as xml2js from "xml2js";

import * as actions from "../../../store/actions/index";

class VideoTab extends React.Component {
  constructor() {
    super();

    this.videoInput = React.createRef();
    this.linkInput = React.createRef();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.youtubeLink === nextProps.youtubeLink) {
      return false;
    }
    return true;
  }

  onOpenVideo = event => {
    const file = event.target.files[0];
    if (file != null) {
      const type = file.type;
      if (
        type === "video/mp4" ||
        type === "video/webm" ||
        type === "video/ogg" ||
        type.startsWith("audio/")
      ) {
        const url = URL.createObjectURL(file);
        if (this.props.url !== url) {
          this.props.videoSelected("", type, url);
        }
      }
    }
  };

  onPlayYTLink = () => {
    const youtubeLink = this.linkInput.current.children[0].value;
    if (this.isYoutubeLink(youtubeLink)) {
      let videoId;
      if (youtubeLink.startsWith("https://www.youtube.com/watch?v=")) {
        const url = new URL(youtubeLink);
        videoId = url.searchParams.get("v");
      } else {
        videoId = youtubeLink.substring(17);
      }
      this.storeVideo(videoId, videoId)
        .then(response => {
          const downloadURL = response.data;
          if (this.propsurl !== downloadURL) {
            this.props.videoSelected(videoId, "video/mp4", downloadURL);
            this.displaySubtitles(videoId);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.props.openSnackbar("This is not a Youtube Link.");
    }
  };

  isYoutubeLink = youtubeLink => {
    return (
      youtubeLink.startsWith("https://www.youtube.com/watch?v=") ||
      youtubeLink.startsWith("https://youtu.be/")
    );
  };

  storeVideo(videoId, name) {
    const url =
      "https://us-central1-jean-subtitle-editor.cloudfunctions.net/youtubedl";
    return axios.post(url, null, {
      params: {
        id: videoId,
        name
      }
    });
  }

  displaySubtitles(videoId) {
    const url = "https://video.google.com/timedtext";
    axios
      .get(url, {
        params: {
          type: "list",
          v: videoId
        }
      })
      .then(result => this.parseXml(result.data));
  }

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

  copyInput = () => {
    if (
      this.linkInput.current.children[0].value &&
      copy(this.linkInput.current.children[0].value)
    ) {
      this.props.openSnackbar("Copied to clipboard.");
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
        <input
          hidden
          type="file"
          accept="video/mp4,video/webm,video/ogg,audio/*"
          ref={this.videoInput}
          onChange={this.onOpenVideo}
        />
        <Button onClick={() => this.videoInput.current.click()}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <VideoCallIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Open Video
            </span>
          </Box>
        </Button>
        <Divider orientation="vertical" />
        <Button onClick={this.onPlayYTLink}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <YouTubeIcon />
            <span
              style={{
                letterSpacing: "-0.5px",
                textTransform: "initial"
              }}
            >
              Play Video
            </span>
          </Box>
        </Button>
        <form noValidate autoComplete="off">
          <Input
            placeholder="Youtube Link"
            defaultValue="https://www.youtube.com/watch?v=2PjZAeiU7uM"
            ref={this.linkInput}
            endAdornment={
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => (this.linkInput.current.children[0].value = "")}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          />
        </form>
        <IconButton aria-label="copy" size="small" onClick={this.copyInput}>
          <FileCopyIcon />
        </IconButton>
        <Divider orientation="vertical" />
      </Box>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.video.player,
    wavesurfer: state.video.wavesurfer,
    url: state.video.url
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoId, videoType, url) =>
      dispatch(actions.videoSelected(videoId, videoType, url)),
    setSubtitleList: subtitleList =>
      dispatch(actions.setSubtitleList(subtitleList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTab);
