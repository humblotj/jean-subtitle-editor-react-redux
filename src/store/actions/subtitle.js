import * as actionTypes from "./actionTypes";

export const setProjectKey = projectKey => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PROJECT_KEY, projectKey });
  };
};

export const setProjectName = projectName => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PROJECT_NAME, projectName });
  };
};

export const subtitleSelected = (
  timeStamp,
  script,
  scriptTranslation,
  preview,
  indexActive
) => {
  return dispatch => {
    dispatch({
      type: actionTypes.SUBTITLE_SELECTED,
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
      type: actionTypes.TRANSLATION_SELECTED,
      timeStamp,
      script,
      scriptTranslation,
      preview
    });
  };
};

export const setSubtitleList = subtitleList => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_SUBTITLELIST, subtitleList });
  };
};

export const updateTimestamp = timeStamp => {
  return dispatch => {
    dispatch({ type: actionTypes.UPDATE_TIMESTAMP, timeStamp });
  };
};

export const updateScript = script => {
  return dispatch => {
    dispatch({ type: actionTypes.UPDATE_SCRIPT, script });
  };
};

export const updateScriptTranslation = scriptTranslation => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_SCRIPT_TRANSLATION,
      scriptTranslation
    });
  };
};

export const updatePreview = preview => {
  return dispatch => {
    dispatch({ type: actionTypes.UPDATE_PREVIEW, preview });
  };
};

export const setIndexActive = indexActive => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_INDEX_ACTIVE, indexActive });
  };
};

export const setPreviousState = previousState => {
  return dispatch => {
    dispatch({ type: actionTypes.SET_PREVIOUS_STATE, previousState });
  };
};

export const loadProject = (
  projectKey,
  projectName,
  timeStamp,
  script,
  scriptTranslation
) => {
  return dispatch => {
    dispatch({
      type: actionTypes.LOAD_PROJECT,
      projectKey,
      projectName,
      timeStamp,
      script,
      scriptTranslation
    });
  };
};
