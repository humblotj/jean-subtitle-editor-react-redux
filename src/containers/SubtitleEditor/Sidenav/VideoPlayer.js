import React, { createRef } from "react";
import { connect } from "react-redux";
import videojs from "video.js";

import * as actions from "../../../store/actions/index";

// eslint-disable-next-line import/no-webpack-loader-syntax
require("!style-loader!css-loader!video.js/dist/video-js.min.css");

class VideoPlayer extends React.Component {
  constructor() {
    super();

    this.videoNode = createRef();
  }

  componentDidMount() {
    const that = this;
    this.player = videojs(
      this.videoNode.current,
      this.props.options,
      function onPlayerReady() {
        console.log("onPlayerReady", this);
        that.props.setPlayer(this);
        this.on("loadedmetadata", () => {
          const date = new Date(null);
          date.setSeconds(this.duration());
          that.props.setDuration(
            date.toISOString().substr(14, 5),
            this.duration()
          );
        });
        this.on("timeupdate", () => {
          const date = new Date(null);
          const currentTime = this.currentTime();
          date.setSeconds(currentTime);
          that.props.setProgress(
            date.toISOString().substr(14, 5),
            (currentTime / that.props.durationSeconds) * 100
          );
        });
        this.on("pause", () => {
          that.props.setPause(true);
        });
        this.on("play", () => {
          that.props.setPause(false);
        });
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.player && prevProps.options !== this.props.options) {
      this.player.src({
        type: this.props.options.sources[0].type,
        src: this.props.options.sources[0].src
      });
    }
  }

  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
      this.player = null;
      this.props.setPlayer(null);
    }
  }

  render() {
    return (
      <div data-vjs-player>
        <video
          ref={this.videoNode}
          className="video-js vjs-big-play-centered mini-play vjs-default-skin vjs-16-9"
        ></video>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    durationSeconds: state.video.durationSeconds,
    duration: state.video.duration
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setPlayer: player => dispatch(actions.setPlayer(player)),
    setPause: pause => dispatch(actions.setPause(pause)),
    setDuration: (duration, durationSeconds) =>
      dispatch(actions.setDuration(duration, durationSeconds)),
    setProgress: (currentTime, progress) =>
      dispatch(actions.setProgress(currentTime, progress)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayer);
