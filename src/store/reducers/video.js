import * as actionTypes from '../actions/actionTypes';

export const initialState = {
  player: null,
  wavesurfer: null,
  rate: 1,
  url: "",
  youtubeLink: "https://www.youtube.com/watch?v=2PjZAeiU7uM",
  videoType: "",
  videoId: "",
  paused: true,
  duration: "",
  durationSeconds: 0,
  currentTime: "00:00",
  progress: 0,
  audioVolume: 0.25,
  timeout: null,
  onTimeUpdate: null
};

const videoReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VIDEO_SELECTED:
      return {
        ...state,
        videoId: "",
        videoType: action.videoType,
        url: action.url,
        rate: 1
      };
    case actionTypes.YT_PLAYED:
      return {
        ...state,
        videoId: action.videoId,
        videoType: "video/mp4",
        url: action.url,
        rate: 1
      };
    case actionTypes.SET_YOUTUBE_LINK:
      return {
        ...state,
        youtubeLink: action.youtubeLink
      };
    case actionTypes.SET_PLAYER:
      return {
        ...state,
        player: action.player
      };
    case actionTypes.SET_PAUSE:
      return {
        ...state,
        paused: action.pause
      };
    case actionTypes.SET_DURATION:
      return {
        ...state,
        duration: action.duration,
        durationSeconds: action.durationSeconds
      };
    case actionTypes.SET_PROGRESS:
      return {
        ...state,
        currentTime: action.currentTime,
        progress: action.progress
      };
    case actionTypes.SET_WAVESURFER:
      return {
        ...state,
        wavesurfer: action.wavesurfer
      };
    case actionTypes.SET_VOLUME:
      return {
        ...state,
        audioVolume: action.audioVolume
      };
    case actionTypes.SET_TIMEOUT:
      return {
        ...state,
        timeout: action.timeout
      };
    case actionTypes.SET_ON_TIME_UPDATE:
      return {
        ...state,
        onTimeUpdate: action.onTimeUpdate
      };
    default:
      return state;
  }
};

export default videoReducer;
