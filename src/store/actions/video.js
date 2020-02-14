import * as actionTypes from "./actionTypes";

export const videoSelected = (videoId, videoType, url) => {
  return dispatch => {
    dispatch({ type: actionTypes.VIDEO_SELECTED, videoId, videoType, url });
  };
};

export const yTLinkPlayed = (videoId, url) => {
  return dispatch => {
    dispatch({ type: actionTypes.YT_PLAYED, videoId, url });
  };
};

export const setYoutubeLink = youtubeLink => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_YOUTUBE_LINK, youtubeLink });
  };
};

export const setPlayer = player => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PLAYER, player });
  };
};

export const setPause = pause => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PAUSE, pause });
  };
};

export const setDuration = (duration, durationSeconds) => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_DURATION, duration, durationSeconds });
  };
};

export const setProgress = (currentTime, progress) => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PROGRESS, currentTime, progress });
  };
};

export const setWavesurfer = wavesurfer => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_WAVESURFER, wavesurfer });
  };
};

export const setVolume = audioVolume => {
  return (dispatch, getState) => {
    const { wavesurfer } = getState().video;
    if (wavesurfer) {
      wavesurfer.setVolume(audioVolume);
    }
    dispatch({ type: actionTypes.SET_VOLUME, audioVolume });
  };
};

export const setTimeout = timeout => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_TIMEOUT, timeout });
  };
};

export const setOnTimeUpdate = onTimeUpdate => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_ON_TIME_UPDATE, onTimeUpdate });
  };
};
