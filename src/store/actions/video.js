export const videoSelected = (videoId, videoType, url) => {
  return dispatch => {
    dispatch({ type: "VIDEO_SELECTED", videoId, videoType, url });
  };
};

export const yTLinkPlayed = (videoId, url) => {
  return dispatch => {
    dispatch({ type: "YT_PLAYED", videoId, url });
  };
};

export const setYoutubeLink = youtubeLink => {
  return dispatch => {
    dispatch({ type: "SET_YOUTUBE_LINK", youtubeLink });
  };
};

export const setPlayer = player => {
  return dispatch => {
    dispatch({ type: "SET_PLAYER", player });
  };
};

export const setPause = pause => {
  return dispatch => {
    dispatch({ type: "SET_PAUSE", pause });
  };
};

export const setDuration = (duration, durationSeconds) => {
  return dispatch => {
    dispatch({ type: "SET_DURATION", duration, durationSeconds });
  };
};

export const setProgress = (currentTime, progress) => {
  return dispatch => {
    dispatch({ type: "SET_PROGRESS", currentTime, progress });
  };
};

export const setWavesurfer = wavesurfer => {
  return dispatch => {
    dispatch({ type: "SET_WAVESURFER", wavesurfer });
  };
};

export const setVolume = audioVolume => {
  return dispatch => {
    dispatch({ type: "SET_VOLUME", audioVolume });
  };
};

export const setTimeout = timeout => {
  return dispatch => {
    dispatch({ type: "SET_TIMEOUT", timeout });
  };
};

export const setOnTimeUpdate = onTimeUpdate => {
  return dispatch => {
    dispatch({ type: "SET_ON_TIME_UPDATE", onTimeUpdate });
  };
};
