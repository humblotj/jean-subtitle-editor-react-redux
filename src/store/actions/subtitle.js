export const subtitleSelected = (
  timeStamp,
  script,
  scriptTranslation,
  preview,
  indexActive
) => {
  return dispatch => {
    dispatch({
      type: "SUBTITLE_SELECTED",
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive
    });
  };
};

export const translationSelected = (
  timeStamp,
  script,
  scriptTranslation,
  preview
) => {
  return dispatch => {
    dispatch({
      type: "TRANSLATION_SELECTED",
      timeStamp,
      script,
      scriptTranslation,
      preview
    });
  };
};

export const setSubtitleList = subtitleList => {
  return dispatch => {
    dispatch({ type: "SET_SUBTITLELIST", subtitleList });
  };
};

export const updateTimestamp = timeStamp => {
  return dispatch => {
    dispatch({ type: "UPDATE_TIMESTAMP", timeStamp });
  };
};

export const updateScript = script => {
  return dispatch => {
    dispatch({ type: "UPDATE_SCRIPT", script });
  };
};

export const updateScriptTranslation = scriptTranslation => {
  return dispatch => {
    dispatch({ type: "UPDATE_SCRIPT_TRANSLATION", scriptTranslation });
  };
};

export const updatePreview = preview => {
  return dispatch => {
    dispatch({ type: "UPDATE_PREVIEW", preview });
  };
};

export const setIndexActive = indexActive => {
  return dispatch => {
    dispatch({ type: "SET_INDEX_ACTIVE", indexActive });
  };
};
