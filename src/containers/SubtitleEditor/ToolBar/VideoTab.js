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

import * as actions from "../../../store/actions/index";
import { EventEmitter } from "../../../Utils/events";

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
    const { youtubeLink } = this.props;
    if (this.isYoutubeLink(youtubeLink)) {
      let videoId;
      if (youtubeLink.startsWith("https://www.youtube.com/watch?v=")) {
        const url = new URL(youtubeLink);
        videoId = url.searchParams.get("v");
      } else {
        videoId = youtubeLink.substring(17);
      }
      EventEmitter.dispatch("playYTLink", videoId);
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
            value={this.props.youtubeLink}
            onChange={event =>
              this.props.setYoutubeLink(event.currentTarget.value)
            }
            ref={this.linkInput}
            endAdornment={
              <IconButton
                aria-label="delete"
                size="small"
                onClick={() => this.props.setYoutubeLink("")}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          />
        </form>
        <IconButton
          aria-label="copy"
          size="small"
          onClick={this.copyInput}
          disabled={!this.props.youtubeLink}
        >
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
    url: state.video.url,
    youtubeLink: state.video.youtubeLink
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    setYoutubeLink: youtubeLink =>
      dispatch(actions.setYoutubeLink(youtubeLink)),
    videoSelected: (videoId, videoType, url) =>
      dispatch(actions.videoSelected(videoId, videoType, url)),
    setSubtitleList: subtitleList =>
      dispatch(actions.setSubtitleList(subtitleList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTab);
