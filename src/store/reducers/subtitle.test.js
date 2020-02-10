import subtitleReducer, { initialState } from "./subtitle";
import * as actionTypes from "../actions/actionTypes";

describe("subtitle reducer", () => {
  it("should return the initial state", () => {
    expect(subtitleReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle SET_PROJECT_KEY", () => {
    expect(
      subtitleReducer(
        { projectKey: "" },
        {
          type: actionTypes.SET_PROJECT_KEY,
          projectKey: "123"
        }
      )
    ).toEqual({
      projectKey: "123"
    });
  });

  it("should handle SET_PROJECT_NAME", () => {
    expect(
      subtitleReducer(
        { projectName: "" },
        {
          type: actionTypes.SET_PROJECT_NAME,
          projectName: "123"
        }
      )
    ).toEqual({
      projectName: "123"
    });
  });

  it("should handle SET_SUBTITLELIST", () => {
    expect(
      subtitleReducer(
        { subtitleList: "" },
        {
          type: actionTypes.SET_SUBTITLELIST,
          subtitleList: ["1", "2"]
        }
      )
    ).toEqual({
      subtitleList: ["1", "2"]
    });
  });

  it("should handle SUBTITLE_SELECTED", () => {
    expect(
      subtitleReducer(initialState, {
        type: actionTypes.SUBTITLE_SELECTED,
        timeStamp: [{ start: 0, end: 1 }],
        script: ["text"],
        scriptTranslation: ["text"],
        preview: ["text"],
        indexActive: 0
      })
    ).toEqual({
      projectKey: "",
      projectName: "Subtitle",
      subtitleList: [],
      timeStamp: [{ start: 0, end: 1 }],
      script: ["text"],
      scriptTranslation: ["text"],
      preview: ["text"],
      indexActive: 0,
      previousIndexActive: null,
      previousState: null
    });
  });

  it("should handle TRANSLATION_SELECTED", () => {
    expect(
      subtitleReducer(initialState, {
        type: actionTypes.TRANSLATION_SELECTED,
        timeStamp: [{ startMs: 0, endMs: 1 }],
        script: ["text"],
        scriptTranslation: ["text"],
        preview: ["text"]
      })
    ).toEqual({
      projectKey: "",
      projectName: "Subtitle",
      subtitleList: [],
      timeStamp: [{ startMs: 0, endMs: 1 }],
      script: ["text"],
      scriptTranslation: ["text"],
      preview: ["text"],
      indexActive: null,
      previousIndexActive: null,
      previousState: null
    });
  });

  it("should handle UPDATE_TIMESTAMP", () => {
    expect(
      subtitleReducer(
        { timeStamp: "" },
        {
          type: actionTypes.UPDATE_TIMESTAMP,
          timeStamp: [{ startMs: 0, endMs: 1 }]
        }
      )
    ).toEqual({
      timeStamp: [{ startMs: 0, endMs: 1 }]
    });
  });

  it("should handle UPDATE_SCRIPT", () => {
    expect(
      subtitleReducer(
        { script: [] },
        {
          type: actionTypes.UPDATE_SCRIPT,
          script: ["text"]
        }
      )
    ).toEqual({
      script: ["text"]
    });
  });

  it("should handle UPDATE_SCRIPT_TRANSLATION", () => {
    expect(
      subtitleReducer(
        { scriptTranslation: [] },
        {
          type: actionTypes.UPDATE_SCRIPT_TRANSLATION,
          scriptTranslation: ["text"]
        }
      )
    ).toEqual({
      scriptTranslation: ["text"]
    });
  });

  it("should handle UPDATE_PREVIEW", () => {
    expect(
      subtitleReducer(
        { preview: [] },
        {
          type: actionTypes.UPDATE_PREVIEW,
          preview: ["text"]
        }
      )
    ).toEqual({
      preview: ["text"]
    });
  });

  it("should handle SET_INDEX_ACTIVE", () => {
    expect(
      subtitleReducer(
        { indexActive: 0, previousIndexActive: null },
        {
          type: actionTypes.SET_INDEX_ACTIVE,
          indexActive: 1
        }
      )
    ).toEqual({
      indexActive: 1,
      previousIndexActive: 0
    });
  });

  it("should handle SET_PREVIOUS_STATE", () => {
    expect(
      subtitleReducer(
        { previousState: null },
        {
          type: actionTypes.SET_PREVIOUS_STATE,
          previousState: []
        }
      )
    ).toEqual({
      previousState: []
    });
  });

  it("should handle LOAD_PROJECT", () => {
    expect(
      subtitleReducer(
        {
          indexActive: 1,
          previousIndexActive: 0,
          projectKey: "",
          projectName: "Subtitle",
          timeStamp: null,
          script: null,
          scriptTranslation: null,
          preview: []
        },
        {
          type: actionTypes.LOAD_PROJECT,
          projectKey: "123",
          projectName: "Name",
          timeStamp: [{ startMs: 0, endMs: 1 }],
          script: ["text"],
          scriptTranslation: ["text"],
        }
      )
    ).toEqual({
      indexActive: 0,
      previousIndexActive: 1,
      projectKey: "123",
      projectName: "Name",
      timeStamp: [{ startMs: 0, endMs: 1 }],
      script: ["text"],
      scriptTranslation: ["text"],
      preview: []
    });
  });
});
