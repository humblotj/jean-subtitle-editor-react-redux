const initialState = {
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
    case "SET_SUBTITLELIST":
      return {
        ...state,
        subtitleList: action.subtitleList
      };
    case "SUBTITLE_SELECTED":
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
    case "TRANSLATION_SELECTED":
      return {
        ...state,
        timeStamp: action.timeStamp,
        script: action.script,
        scriptTranslation: action.scriptTranslation,
        preview: action.preview
      };
    case "UPDATE_TIMESTAMP":
      return {
        ...state,
        timeStamp: action.timeStamp
      };
    case "UPDATE_SCRIPT":
      return {
        ...state,
        script: action.script
      };
    case "UPDATE_SCRIPT_TRANSLATION":
      return {
        ...state,
        scriptTranslation: action.scriptTranslation
      };
    case "UPDATE_PREVIEW":
      return {
        ...state,
        preview: action.preview
      };
    case "SET_INDEX_ACTIVE":
      return {
        ...state,
        previousIndexActive: state.indexActive,
        indexActive: action.indexActive
      };
    case "SET_PREVIOUS_STATE":
      return {
        ...state,
        previousState: action.previousState
      };
    default:
      return state;
  }
};

export default subtitleReducer;
