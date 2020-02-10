import * as actionTypes from '../actions/actionTypes';

export const initialState = {
  projectKey: "",
  projectName: "Subtitle",
  subtitleList: [],
  timeStamp: [],
  script: [],
  scriptTranslation: [],
  preview: [],
  indexActive: null,
  previousIndexActive: null,
  previousState: null
};

const subtitleReducer = (state = initialState, action) => {
  console.log(action);
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
        timeStamp: action.timeStamp
      };
    case actionTypes.UPDATE_SCRIPT:
      return {
        ...state,
        script: action.script
      };
    case actionTypes.UPDATE_SCRIPT_TRANSLATION:
      return {
        ...state,
        scriptTranslation: action.scriptTranslation
      };
    case actionTypes.UPDATE_PREVIEW:
      return {
        ...state,
        preview: action.preview
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
