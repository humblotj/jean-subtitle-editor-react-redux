import React, { createRef } from "react";
import { connect } from "react-redux";

import * as actions from "../../../store/actions/index";
import VideoPlayer from "./VideoPlayer";
import PlayerControls from "./PlayerControls";
import ScriptPreview from "../../../components/Sidenav/ScriptPreview";

class Sidenav extends React.Component {
  constructor() {
    super();

    this.videoNode = createRef();

    this.state = {
      options: null
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      if (this.props.url) {
        this.setState({
          options: {
            sources: [
              {
                src: this.props.url,
                type: this.props.videoType
              }
            ],
            controls: false,
            muted: true,
            preload: "auto",
            techOrder: ["html5"],
            inactivityTimeout: 1
          }
        });
      } else {
        this.setState({ options: null });
      }
    }
  }

  render() {
    const { options } = this.state;
    const { script, scriptTranslation, indexActive } = this.props;

    if (options === null) {
      return null;
    }
    return (
      <div>
        <VideoPlayer options={options} />
        <PlayerControls />
        <ScriptPreview
          script={script}
          scriptTranslation={scriptTranslation}
          indexActive={indexActive}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.video.player,
    videoType: state.video.videoType,
    url: state.video.url,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    indexActive: state.subtitle.indexActive
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoType, url) =>
      dispatch(actions.videoSelected(videoType, url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidenav);
