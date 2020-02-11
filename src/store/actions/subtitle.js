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

export const removeLines = (begin, end) => {
  return (dispatch, getState) => {
    const { indexActive, timeStamp } = getState();
    const newLength = timeStamp.length - (end - begin + 1);
    const newIndexActive =
      indexActive < newLength ? indexActive : newLength ? 0 : null;

    dispatch({
      type: actionTypes.REMOVE_LINES,
      begin,
      end,
      indexActive: newIndexActive
    });
  };
};

export const removeEmptyLines = () => {
  return (dispatch, getState) => {
    const timeStamp = getState().timeStamp.slice();
    const script = getState().script.slice();
    const scriptTranslation = getState().scriptTranslation.slice();
    const preview = getState().preview.slice();
    const { indexActive } = getState();

    let i = timeStamp.length;
    let newLength = timeStamp.length;
    while (i--) {
      if (script[i] === "") {
        timeStamp.splice(i, 1);
        script.splice(i, 1);
        scriptTranslation.splice(i, 1);
        preview.splice(i, 1);
        newLength--;
      }
    }

    dispatch({
      type: actionTypes.REMOVE_EMPTY_LINES,
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive: !newLength
        ? null
        : indexActive < newLength
        ? indexActive
        : newLength
    });
  };
};

export const fixOverlapping = () => {
  return (dispatch, getState) => {
    const timeStamp = getState().timeStamp.map((time, index) => {
      if (
        index !== timeStamp.length - 1 &&
        time.endMs > timeStamp[index + 1].startMs
      ) {
        return { startMs: time.startMs, endMs: timeStamp[index + 1].startMs };
      } else {
        return time;
      }
    });

    dispatch({ type: actionTypes.SET_INDEX_ACTIVE, timeStamp });
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
