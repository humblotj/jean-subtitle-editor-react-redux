import React from "react";
import * as WaveSurfer from "wavesurfer.js";
import * as RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.js";
import * as TimelinePlugin from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import { connect } from "react-redux";

import * as actions from "../../../../store/actions/index";
import { EventEmitter } from "../../../../Utils/events";

class Audiovizualiser extends React.Component {
  constructor() {
    super();

    this.regions = [];
    this.adjacentTimeTmp = {};
    this.adjacentTimeUpdated = false;
    this.previousState = null;

    this.state = {
      progress: 100
    };

    EventEmitter.subscribe("indexActiveChange", event => {
      this.pause();
      this.setIndexActive(event);
      const duration = this.wavesurfer
        ? this.wavesurfer.getDuration()
        : this.props.player
        ? this.props.player.getDuration()
        : null;
      if (duration) {
        this.seekTo(this.props.timeStamp[event].startMs / 10 / duration);
      }
    });

    EventEmitter.subscribe("refreshRegion", () => {
      this.timeoutLoadRegions();
    });
  }

  componentDidMount() {
    this.wavesurfer = WaveSurfer.create({
      container: "#waveform",
      height: 100,
      barHeight: 0.6,
      scrollParent: true,
      partialRender: false,
      pixelRatio: 1,
      autoCenter: true,
      interact: true,
      minPxPerSec: 1,
      plugins: [
        RegionsPlugin.create({}),
        TimelinePlugin.create({
          container: "#waveform-timeline"
        })
      ]
    });

    this.setState({ progress: 0 });
    this.wavesurfer.load(this.props.url);
    this.wavesurfer.zoom(150);
    this.wavesurfer.setVolume(0.25);

    const that = this;

    this.wavesurfer.on("loading", e => {
      this.setState({ progress: e });
      if (e === 100) {
        that.props.setWavesurfer(that.wavesurfer);
        setTimeout(this.timeoutLoadRegions, 1000);
      }
    });

    this.wavesurfer.on("interaction", e => {
      // this.seekTo.emit(e * 100);
    });

    this.wavesurfer.on("region-updated", e => {
      that.props.timeStamp[e.id].startMs = Math.floor(e.start * 100) * 10;
      that.props.timeStamp[e.id].endMs = Math.floor(e.end * 100) * 10;

      // save adjacent timestamp for resizing purpose
      if (that.adjacentTimeUpdated === false) {
        if (e.id !== that.props.timeStamp.length - 1) {
          that.adjacentTimeTmp.start = that.props.timeStamp[e.id + 1].startMs;
        }
        if (e.id !== 0) {
          that.adjacentTimeTmp.end = that.props.timeStamp[e.id - 1].endMs;
        }
        that.adjacentTimeUpdated = true;
      }
      that.props.updateTimestamp([...that.props.timeStamp]);
    });

    this.wavesurfer.on("region-update-end", e => {
      that.adjacentTimeUpdated = false;
    });

    this.wavesurfer.on("region-click", event => {
      this.pause();
      if (event.id !== this.indexActive) {
        this.setIndexActive(event.id);
        // if (this.viewPort) {
        //   this.viewPort.scrollToIndex(this.indexActive - 1, "smooth");
        // }
      }
    });

    this.wavesurfer.on("region-in", event => {
      if (
        event.id !== that.props.indexActive &&
        this.props.timeout === null
        // && this.repeatTimeout === null
      ) {
        if (
          that.props.timeStamp[event.id].startMs -
            that.props.timeStamp[that.props.indexActive].startMs >
          300
        ) {
          this.setIndexActive(event.id);
        }
      }
    });

    this.wavesurfer.on("pause", () => that.props.setPause(true));
    this.wavesurfer.on("play", () => that.props.setPause(false));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.props.url === nextProps.url &&
      this.props.progress === nextProps.progress
    ) {
      return false;
    }
    return true;
  }

  seekTo = progress => {
    if (progress >= 0 && progress <= 100) {
      this.props.setProgress("", progress);
      if (this.props.player) {
        const time = (this.props.player.duration() * progress) / 100;
        this.props.player.currentTime(time);
      }
      if (this.wavesurfer) {
        this.wavesurfer.seekAndCenter(progress / 100);
      }
    }
  };

  pause = () => {
    clearTimeout(this.props.timeout);
    this.props.setTimeout(null);

    if (this.props.player) {
      if (this.props.onTimeUpdate) {
        this.props.player.off("timeupdate", this.props.onTimeUpdate);
        this.props.setOnTimeUpdate(null);
      }

      this.props.player.pause();
    }
    if (this.wavesurfer) {
      this.wavesurfer.pause();
    }
  };

  timeoutLoadRegions = () => {
    if (this.wavesurfer.isReady) {
      if (this.props.timeStamp.length) {
        this.loadRegions();
      }
    } else {
      setTimeout(this.timeoutLoadRegions, 1000);
    }
  };

  loadRegions = () => {
    const { timeStamp, indexActive } = this.props;
    if (this.wavesurfer) {
      this.wavesurfer.clearRegions();
      for (let i = 0; i < timeStamp.length; i++) {
        if (i !== indexActive) {
          this.addRegion(
            i,
            false,
            i % 2 === 0 ? "rgba(0,0,128,.1)" : "hsla(100, 100%, 30%, 0.1)"
          );
        }
      }
      this.addRegionActive(indexActive);
    }
  };

  addRegion = (id, resize, color) => {
    const { timeStamp, script, scriptTranslation } = this.props;
    if (id !== null) {
      const duration = this.wavesurfer.getDuration();
      if (timeStamp[id].endMs / 1000 < duration) {
        switch ("original text") {
          case "none":
            this.wavesurfer.addRegion({
              id,
              start: timeStamp[id].startMs / 1000,
              end: timeStamp[id].endMs / 1000,
              drag: false,
              resize,
              color,
              attributes: {
                id: id + 1
              }
            });
            break;
          case "original text":
            this.wavesurfer.addRegion({
              id,
              start: timeStamp[id].startMs / 1000,
              end: timeStamp[id].endMs / 1000,
              drag: false,
              resize,
              color,
              attributes: {
                id: id + 1,
                top: script[id].replace(/\{(.*?)\}|\|/gi, "")
              }
            });
            break;
          case "translation":
            this.wavesurfer.addRegion({
              id,
              start: timeStamp[id].startMs / 1000,
              end: timeStamp[id].endMs / 1000,
              drag: false,
              resize,
              color,
              attributes: {
                id: id + 1,
                top: scriptTranslation[id].replace(/\{(.*?)\}|\|/gi, "")
              }
            });
            break;
          case "both":
            this.wavesurfer.addRegion({
              id,
              start: timeStamp[id].startMs / 1000,
              end: timeStamp[id].endMs / 1000,
              drag: false,
              resize,
              color,
              attributes: {
                id: id + 1,
                top: script[id].replace(/\{(.*?)\}|\|/gi, ""),
                bottom: scriptTranslation[id].replace(/\{(.*?)\}|\|/gi, "")
              }
            });
            break;
          default:
            return;
        }
        if (typeof timeStamp[id - 1] !== "undefined") {
          if (timeStamp[id - 1].startMs === timeStamp[id].startMs) {
            this.wavesurfer.regions.list[id].element.className += " overlapped";
          } else {
            if (
              this.wavesurfer.regions.list[id].element.classList.contains(
                "overlapped"
              )
            ) {
              this.wavesurfer.regions.list[id].element.classList.remove(
                "overlapped"
              );
            }
          }
        }
      }
    }
  };

  addRegionActive = id => {
    const { timeStamp } = this.props;
    if (id !== null) {
      this.addRegion(id, true, "hsla(360, 100%, 50%, 0.3)");
      this.wavesurfer.regions.list[id].element.style.zIndex = 3;

      const that = this;
      this.wavesurfer.regions.list[id].onResize = function(delta, direction) {
        // re-implement existing functionality so interface updates work
        if (direction === "start") {
          const start = Math.min(this.start + delta, this.end);
          const end = Math.max(this.start + delta, this.end);
          this.update({
            start,
            end
          });
        } else {
          const start = Math.min(this.end + delta, this.start);
          const end = Math.max(this.end + delta, this.start);
          this.update({
            start,
            end
          });
        }
        // resize the region adjacent to this one
        that.resizeAdjacent(this, direction);
      };
      this.regions = [];
      if (id !== 0) {
        this.regions.push(this.wavesurfer.regions.list[id - 1]);
      }
      this.regions.push(this.wavesurfer.regions.list[id]);
      if (id !== timeStamp.length - 1) {
        this.regions.push(this.wavesurfer.regions.list[id + 1]);
      }
    }
  };

  resizeAdjacent = (obj, direction) => {
    const index = this.regions.indexOf(obj);
    if (direction === "start" && index > 0) {
      if (this.adjacentTimeTmp.end > obj.start * 1000) {
        this.regions[index - 1].update({
          end: obj.start
        });
      }
    } else if (direction === "end") {
      if (this.adjacentTimeTmp.start < obj.end * 1000) {
        this.regions[index + 1].update({
          start: obj.end
        });
      }
    }
  };

  setIndexActive = index => {
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
        console.log("ok");
      } else {
        EventEmitter.dispatch("doBis", iTmp);
        console.log("do");
      }
    }

    this.props.setPreviousState({
      timeStamp: JSON.parse(JSON.stringify(timeStamp[index])),
      script: script[index],
      scriptTranslation: scriptTranslation[index],
      preview: JSON.parse(JSON.stringify(preview[index]))
    });

    if (this.wavesurfer) {
      if (
        indexActive !== null &&
        indexActive !== index &&
        typeof this.wavesurfer.regions.list[indexActive] !== "undefined"
      ) {
        this.wavesurfer.regions.list[indexActive].unAll();
        this.wavesurfer.regions.list[indexActive].remove();

        this.addRegion(
          indexActive,
          false,
          indexActive % 2 === 0
            ? "rgba(0,0,128,.1)"
            : "hsla(100, 100%, 30%, 0.1)"
        );
      }
      if (typeof this.wavesurfer.regions.list[index] !== "undefined") {
        this.wavesurfer.regions.list[index].remove();
        this.addRegionActive(index);
      }
    }
    this.props.setIndexActive(index);
  };

  componentDidUpdate(prevProps) {
    if (this.wavesurfer) {
      if (prevProps.url !== this.props.url) {
        this.wavesurfer.load(this.props.url);
      }
    }
  }

  componentWillUnmount() {
    if (this.wavesurfer) {
      this.wavesurfer.destroy();
      this.wavesurfer = null;
      this.props.setWavesurfer(null);
    }
  }

  render() {
    const { progress } = this.state;
    return (
      <div>
        {progress !== 100 && (
          <div style={{ display: "flex" }}>
            <CircularProgress color="secondary" size={24} />
            <span style={{ marginTop: "4px" }}>{progress}%</span>
          </div>
        )}
        <div
          id="waveform"
          style={{ display: progress !== 100 ? "none" : "block" }}
        ></div>
        <div
          id="waveform-timeline"
          style={{ display: progress !== 100 ? "none" : "block" }}
        ></div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    timeStamp: state.subtitle.timeStamp,
    script: state.subtitle.script,
    scriptTranslation: state.subtitle.scriptTranslation,
    preview: state.subtitle.preview,
    indexActive: state.subtitle.indexActive,
    player: state.video.player,
    timeout: state.video.timeout,
    onTimeUpdate: state.video.onTimeUpdate,
    previousState: state.subtitle.previousState
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setWavesurfer: wavesurfer => dispatch(actions.setWavesurfer(wavesurfer)),
    setPause: pause => dispatch(actions.setPause(pause)),
    updateTimestamp: timeStamp => dispatch(actions.updateTimestamp(timeStamp)),
    setIndexActive: indexActive =>
      dispatch(actions.setIndexActive(indexActive)),
    setTimeout: timeout => dispatch(actions.setTimeout(timeout)),
    setOnTimeUpdate: onTimeUpdate =>
      dispatch(actions.setOnTimeUpdate(onTimeUpdate)),
    setProgress: (currentTime, progress) =>
      dispatch(actions.setProgress(currentTime, progress)),
    setPreviousState: previousState =>
      dispatch(actions.setPreviousState(previousState))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Audiovizualiser);
