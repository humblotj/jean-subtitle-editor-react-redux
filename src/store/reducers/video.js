const initialState = {
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
    case "VIDEO_SELECTED":
      return {
        ...state,
        videoId: action.videoId,
        videoType: action.videoType,
        url: action.url,
        rate: 1
      };
    case "YT_PLAYED":
      return {
        ...state,
        videoId: action.videoId,
        videoType: "video/mp4",
        url: action.url,
        rate: 1
      };
    case "SET_YOUTUBE_LINK":
      return {
        ...state,
        youtubeLink: action.youtubeLink
      };
    case "SET_PLAYER":
      return {
        ...state,
        player: action.player
      };
    case "SET_PAUSE":
      return {
        ...state,
        paused: action.pause
      };
    case "SET_DURATION":
      return {
        ...state,
        duration: action.duration,
        durationSeconds: action.durationSeconds
      };
    case "SET_PROGRESS":
      return {
        ...state,
        currentTime: action.currentTime,
        progress: action.progress
      };
    case "SET_WAVESURFER":
      return {
        ...state,
        wavesurfer: action.wavesurfer
      };
    case "SET_VOLUME":
      return {
        ...state,
        audioVolume: action.audioVolume
      };
    case "SET_TIMEOUT":
      return {
        ...state,
        timeout: action.timeout
      };
    case "SET_ON_TIME_UPDATE":
      return {
        ...state,
        onTimeUpdate: action.onTimeUpdate
      };
    default:
      return state;
  }
};

export default videoReducer;
