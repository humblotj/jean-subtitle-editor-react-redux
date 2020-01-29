import React from "react";
import { connect } from "react-redux";
import { FixedSizeList } from "react-window";
import Autosizer from "react-virtualized-auto-sizer";

import * as actions from "../../../store/actions/index";
import Audiovizualiser from "./Audiovizualiser/Audiovizualiser";
import ScriptLine from "../../../components/ScriptLine/ScriptLine";

class Main extends React.Component {
  renderRow = props => {
    const { index, style } = props;

    return <ScriptLine style={style} key={index} index={index} />;
  };
  render() {
    const { url, timeStamp } = this.props;
    return (
      <div
        style={{
          width: "100%",
          height: url ? "calc(100vh - 217px)" : "calc(100vh - 97px)"
        }}
      >
        <div style={{ height: "97px" }} />
        {url && <Audiovizualiser url={url} />}
        {timeStamp.length > 0 && (
          <Autosizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={72}
                itemCount={timeStamp.length}
              >
                {this.renderRow}
              </FixedSizeList>
            )}
          </Autosizer>
        )}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    url: state.video.url,
    timeStamp: state.subtitle.timeStamp
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoType, url) =>
      dispatch(actions.videoSelected(videoType, url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
