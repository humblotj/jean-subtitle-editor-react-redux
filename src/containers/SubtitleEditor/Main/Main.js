import React from "react";
import { connect } from "react-redux";
import { FixedSizeList } from "react-window";
import Autosizer from "react-virtualized-auto-sizer";

import * as actions from "../../../store/actions/index";
import * as SubtitleParser from "../../../Utils/SubtitleParser";
import { EventEmitter } from "../../../Utils/events";
import Audiovizualiser from "./Audiovizualiser/Audiovizualiser";
import ScriptLine from "../../../components/ScriptLine/ScriptLine";

class Main extends React.Component {
  scriptChanged = event => {
    const { index } = this.props;
    this.props.updateScript(index, event.currentTarget.value);
  };

  scriptTranslationChanged = event => {
    const { index } = this.props;
    this.props.updateScriptTranslation(index, event.currentTarget.value);
  };

  startTimeChanged = event => {
    if (event.currentTarget.value.match(/^[0-5][0-9]:[0-5][0-9].[0-9]{2}/)) {
      const { index } = this.props;
      const startTime = SubtitleParser.timeToMs(event.currentTarget.value);
      this.props.updateTimestamp(index, startTime, null);
    } else {
      const startTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].startMs
      );
      this.setState({ startTime });
    }
  };

  endTimeChanged = event => {
    if (event.currentTarget.value.match(/^[0-5][0-9]:[0-5][0-9].[0-9]{2}/)) {
      const { index } = this.props;
      const endTime = SubtitleParser.timeToMs(event.currentTarget.value);
      this.props.updateTimestamp(index, null, endTime);
    } else {
      const endTime = SubtitleParser.msToTime(
        this.props.timeStamp[this.props.index].endMs
      );
      this.setState({ endTime });
    }
  };

  playRegionHandler = index => {
    const time = this.props.timeStamp[index];
    this.playInterval(time.startMs / 1000, time.endMs / 1000);
  };

  playInterval = (start, end) => {
    const { wavesurfer, player, rate, timeout } = this.props;
    clearTimeout(timeout);
    if (this.onTimeUpdate) {
      this.props.player.off("timeupdate", this.onTimeUpdate);
      this.onTimeUpdate = null;
    }

    if (start < end - 0.5 && wavesurfer !== null) {
      if (player === null) {
        wavesurfer.seekAndCenter(start / wavesurfer.getDuration());
        wavesurfer.play(start, end);
        const newTimeout = setTimeout(() => {
          wavesurfer.seekAndCenter(end / wavesurfer.getDuration());
          wavesurfer.pause();
          this.props.setTimeout(null);
        }, ((end - start) * 1000) / rate);
        this.props.setTimeout(newTimeout);
      } else {
        wavesurfer.seekAndCenter(start / wavesurfer.getDuration());
        player.currentTime(start);

        player.play();
        wavesurfer.play(start, end);

        player.on(
          "timeupdate",
          (this.onTimeUpdate = e => {
            // current time is given in seconds
            if (player.currentTime() >= end) {
              player.pause();
              player.off("timeupdate", this.onTimeUpdate);
              this.props.setOnTimeUpdate(null);
            }
          })
        );
        const newTimeout = setTimeout(() => {
          wavesurfer.seekAndCenter(end / wavesurfer.getDuration());
          wavesurfer.pause();
          this.props.setTimeout(null);
        }, ((end - start) * 1000) / rate);

        this.props.setTimeout(newTimeout);
        this.props.setOnTimeUpdate(this.onTimeUpdate);
      }
    }
  };

  lineClick = index => {
    if (index !== this.props.indexActive) {
      if (this.props.wavesurfer) {
        EventEmitter.dispatch("indexActiveChange", index);
      } else {
        const {
          indexActive,
          timeStamp,
          script,
          scriptTranslation,
          preview,
          previousState
        } = this.props;

        if (previousState !== null && indexActive !== null) {
          const iTmp = indexActive;
          if (
            previousState.script === script[iTmp] &&
            previousState.scriptTranslation === scriptTranslation[iTmp] &&
            previousState.timeStamp.startMs === timeStamp[iTmp].startMs &&
            previousState.timeStamp.endMs === timeStamp[iTmp].endMs
          ) {
          } else {
            EventEmitter.dispatch("doBis", iTmp);
            // this.doBis(iTmp);
            console.log("do");
          }
        }

        this.props.setPreviousState({
          timeStamp: JSON.parse(JSON.stringify(timeStamp[index])),
          script: script[index],
          scriptTranslation: scriptTranslation[index],
          preview: JSON.parse(JSON.stringify(preview[index]))
        });

        this.props.setIndexActive(index);
      }
    }
  };

  renderRow = props => {
    const { index, style } = props;
    const {
      indexActive,
      timeStamp,
      script,
      scriptTranslation,
      paused,
      scriptChanged,
      scriptTranslationChanged,
      startTimeChanged,
      endTimeChanged,
      playRegionHandler,
      lineClick
    } = props.data;

    return (
      <ScriptLine
        style={style}
        key={index}
        index={index}
        paused={paused}
        indexActive={indexActive}
        startMs={timeStamp[index].startMs}
        endMs={timeStamp[index].endMs}
        scriptValue={script[index]}
        scriptTranslationValue={scriptTranslation[index]}
        scriptChanged={scriptChanged}
        scriptTranslationChanged={scriptTranslationChanged}
        startTimeChanged={startTimeChanged}
        endTimeChanged={endTimeChanged}
        playRegion={playRegionHandler}
        lineClick={lineClick}
      />
    );
  };

  render() {
    const {
      url,
      indexActive,
      timeStamp,
      script,
      scriptTranslation,
      paused
    } = this.props;
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
                itemData={{
                  paused,
                  indexActive,
                  timeStamp,
                  script,
                  scriptTranslation,
                  scriptChanged: this.scriptChanged,
                  scriptTranslationChanged: this.scriptTranslationChanged,
                  startTimeChanged: this.startTimeChanged,
                  endTimeChanged: this.endTimeChanged,
                  playRegionHandler: this.playRegionHandler,
                  lineClick: this.lineClick
                }}
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
    indexActive: state.subtitle.indexActive,
    paused: state.video.paused,
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    preview: state.subtitle.preview,
    wavesurfer: state.video.wavesurfer,
    player: state.video.player,
    rate: state.video.rate,
    timeout: state.video.timeout,
    previousState: state.subtitle.previousState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    openSnackbar: message => dispatch(actions.openSnackbar(message)),
    videoSelected: (videoType, url) =>
      dispatch(actions.videoSelected(videoType, url)),
    updateTimestamp: (index, startMs, endMs) =>
      dispatch(actions.updateTimestamp(index, startMs, endMs)),
    updateScript: (index, value) =>
      dispatch(actions.updateScript(index, value)),
    updateScriptTranslation: (index, value) =>
      dispatch(actions.updateScriptTranslation(index, value)),
    setTimeout: timeout => dispatch(actions.setTimeout(timeout)),
    setOnTimeUpdate: onTimeUpdate =>
      dispatch(actions.setOnTimeUpdate(onTimeUpdate)),
    setIndexActive: indexActive =>
      dispatch(actions.setIndexActive(indexActive)),
    setPreviousState: previousState =>
      dispatch(actions.setPreviousState(previousState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
