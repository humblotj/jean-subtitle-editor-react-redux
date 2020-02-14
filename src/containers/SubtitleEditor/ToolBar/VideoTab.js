import React from "react";
import { connect } from "react-redux";
import { Box, Divider } from "@material-ui/core";
import {
  VideoCall as VideoCallIcon,
  YouTube as YouTubeIcon
} from "@material-ui/icons";

import * as actions from "../../../store/actions/index";
import { EventEmitter } from "../../../Utils/events";
import ButtonTextIcon from "../../../components/UI/ButtonTextIcon";
import InputCopy from "../../../components/UI/InputCopy";

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
        <ButtonTextIcon
          icon={VideoCallIcon}
          text={"Open Video"}
          clickHandler={() => this.videoInput.current.click()}
          disabled={false}
        />
        <Divider orientation="vertical" />
        <ButtonTextIcon
          icon={YouTubeIcon}
          text={"Play Video"}
          clickHandler={this.onPlayYTLink}
          disabled={false}
        />
        <InputCopy
          placeholder={"Youtube Link"}
          value={this.props.youtubeLink}
          setValue={this.props.setYoutubeLink}
        />
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
      dispatch(actions.videoSelected(videoId, videoType, url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoTab);
