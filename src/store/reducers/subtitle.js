import * as actionTypes from "../actions/actionTypes";

export const initialState = {
  projectKey: "",
  projectName: "Subtitle",
  subtitleList: [],
  timeStamp: [],
  script: [],
  scriptTranslation: [],
  preview: [], //not implemented in react project version
  indexActive: null,
  previousIndexActive: null,
  previousState: null
};

const subtitleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PROJECT_KEY:
      return {
        ...state,
        projectKey: action.projectKey
      };
    case actionTypes.SET_PROJECT_NAME:
      return {
        ...state,
        projectName: action.projectName
      };
    case actionTypes.SET_SUBTITLELIST:
      return {
        ...state,
        subtitleList: action.subtitleList
      };
    case actionTypes.SUBTITLE_SELECTED:
      return {
        ...state,
        projectName: "Subtitle",
        timeStamp: action.timeStamp,
        script: action.script,
        scriptTranslation: action.scriptTranslation,
        preview: action.preview,
        indexActive: action.indexActive,
        previousIndexActive: null
      };
    case actionTypes.TRANSLATION_SELECTED:
      return {
        ...state,
        timeStamp: action.timeStamp,
        script: action.script,
        scriptTranslation: action.scriptTranslation,
        preview: action.preview
      };
    case actionTypes.UPDATE_TIMESTAMP:
      return {
        ...state,
        timeStamp: state.timeStamp.map((time, i) =>
          i === action.index
            ? {
                startMs:
                  action.startMs !== undefined && action.startMs !== null
                    ? action.startMs
                    : time.startMs,
                endMs:
                  action.endMs !== undefined && action.endMs !== null
                    ? action.endMs
                    : time.startMs
              }
            : { ...time }
        )
      };
    case actionTypes.UPDATE_SCRIPT:
      return {
        ...state,
        script: state.script.map((text, i) =>
          i === action.index ? action.value : text
        )
      };
    case actionTypes.UPDATE_SCRIPT_TRANSLATION:
      return {
        ...state,
        scriptTranslation: state.scriptTranslation.map((text, i) =>
          i === action.index ? action.value : text
        )
      };
    case actionTypes.UPDATE_PREVIEW:
      return {
        ...state,
        preview: action.preview
      };
    case actionTypes.REMOVE_LINES:
      return {
        ...state,
        timeStamp: [
          ...state.timeStamp.slice(0, action.begin),
          ...state.timeStamp.slice(action.end + 1)
        ],
        script: [
          ...state.script.slice(0, action.begin),
          ...state.script.slice(action.end + 1)
        ],
        scriptTranslation: [
          ...state.scriptTranslation.slice(0, action.begin),
          ...state.scriptTranslation.slice(action.end + 1)
        ],
        preview: [
          ...state.preview.slice(0, action.begin),
          ...state.preview.slice(action.end + 1)
        ],
        indexActive: action.indexActive
      };
    case actionTypes.UPDATE_ALL:
      return {
        ...state,
        timeStamp: action.timeStamp,
        script: action.script,
        scriptTranslation: action.scriptTranslation,
        preview: action.preview,
        indexActive: action.indexActive
      };
    case actionTypes.SET_TIMESTAMP:
      return {
        ...state,
        timeStamp: action.timeStamp
      };
    case actionTypes.SET_INDEX_ACTIVE:
      return {
        ...state,
        previousIndexActive: state.indexActive,
        indexActive: action.indexActive
      };
    case actionTypes.SET_PREVIOUS_STATE:
      return {
        ...state,
        previousState: action.previousState
      };
    case actionTypes.LOAD_PROJECT:
      return {
        ...state,
        indexActive: 0,
        previousIndexActive: state.indexActive,
        projectKey: action.projectKey,
        projectName: action.projectName,
        timeStamp: action.timeStamp,
        script: action.script,
        scriptTranslation: action.scriptTranslation,
        preview: []
      };
    default:
      return state;
  }
};

export default subtitleReducer;
