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

export const updateTimestamp = (index, startMs, endMs) => {
  return dispatch => {
    dispatch({ type: actionTypes.UPDATE_TIMESTAMP, index, startMs, endMs });
  };
};

export const updateScript = (index, value) => {
  return dispatch => {
    dispatch({ type: actionTypes.UPDATE_SCRIPT, index, value });
  };
};

export const updateScriptTranslation = (index, value) => {
  return dispatch => {
    dispatch({
      type: actionTypes.UPDATE_SCRIPT_TRANSLATION,
      index,
      value
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
    const { indexActive, timeStamp } = getState().subtitle;
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
    const timeStamp = getState().subtitle.timeStamp.map(item => ({ ...item }));
    const script = getState().subtitle.script.slice();
    const scriptTranslation = getState().subtitle.scriptTranslation.slice();
    const preview = getState().subtitle.preview.map(item => ({ ...item }));
    const { indexActive } = getState().subtitle;

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
      type: actionTypes.UPDATE_ALL,
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive: !newLength
        ? null
        : indexActive < newLength
        ? indexActive
        : newLength - 1
    });
  };
};

export const fixOverlapping = () => {
  return (dispatch, getState) => {
    const { timeStamp } = getState().subtitle;
    const newTimeStamp = timeStamp.map((time, index) => {
      if (
        index !== timeStamp.length - 1 &&
        time.endMs > timeStamp[index + 1].startMs
      ) {
        return { startMs: time.startMs, endMs: timeStamp[index + 1].startMs };
      } else {
        return time;
      }
    });

    dispatch({ type: actionTypes.SET_TIMESTAMP, timeStamp: newTimeStamp });
  };
};

export const mergeToSentences = maxChar => {
  return (dispatch, getState) => {
    const timeStamp = getState().subtitle.timeStamp.map(item => ({ ...item }));
    const script = getState().subtitle.script.slice();
    const scriptTranslation = getState().subtitle.scriptTranslation.slice();
    const preview = getState().subtitle.preview.map(item => ({ ...item }));
    const { indexActive } = getState().subtitle;

    let i = timeStamp.length;
    let newLength = timeStamp.length;

    const regexEnd = /[^.?!)]$/g;
    // const regexBegin = /^[a-z]/g;

    while (i--) {
      if (i === 0) {
        break;
      }
      if (
        script[i - 1].match(
          regexEnd
        ) /*&& script[i].sentence.match(regexBegin)*/
      ) {
        const newScript = (
          script[i - 1].trim() +
          " " +
          script[i].trim()
        ).trim();
        if (newScript.length < maxChar) {
          timeStamp[i - 1] = {
            startMs: timeStamp[i - 1].startMs,
            endMs: timeStamp[i].endMs
          };
          timeStamp.splice(i, 1);
          script[i - 1] = newScript;
          script.splice(i, 1);
          scriptTranslation[i - 1] = (
            scriptTranslation[i - 1].trim() +
            " " +
            scriptTranslation[i].trim()
          ).trim();
          scriptTranslation.splice(i, 1);
          preview[i - 1] = {
            en: (preview[i - 1].en.trim() + " " + preview[i].en.trim()).trim(),
            // ko: (preview[i - 1].ko.trim() + " " + preview[i].ko.trim()).trim(),
            // rpa: (
            //   preview[i - 1].rpa.trim() +
            //   " " +
            //   preview[i].rpa.trim()
            // ).trim()
          };
          preview.splice(i, 1);
          newLength--;
        }
      }
    }

    dispatch({
      type: actionTypes.UPDATE_ALL,
      timeStamp,
      script,
      scriptTranslation,
      preview,
      indexActive: !newLength
        ? null
        : indexActive < newLength
        ? indexActive
        : newLength - 1
    });
  };
};

export const shiftTimes = (forward, target, begin, end, time) => {
  return (dispatch, getState) => {
    if (forward === "backward") {
      time = -time;
    }
    const timeStamp = getState().subtitle.timeStamp.map((item, index) => {
      if (index >= begin && index < end) {
        switch (target) {
          case "start":
            return {
              ...time,
              startMs: item.startMs + time >= 0 ? item.startMs + time : 0
            };
          case "end":
            return {
              ...time,
              endMs: item.endMs + time >= 0 ? item.endMs + time : 0
            };
          default:
            return {
              startMs: item.startMs + time >= 0 ? item.startMs + time : 0,
              endMs: item.endMs + time >= 0 ? item.endMs + time : 0
            };
        }
      } else {
        return { ...item };
      }
    });
    dispatch({ type: actionTypes.SET_TIMESTAMP, timeStamp });
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
