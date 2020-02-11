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
        { script: ["text"] },
        {
          type: actionTypes.UPDATE_SCRIPT,
          index: 0,
          value: "new"
        }
      )
    ).toEqual({
      script: ["new"]
    });
  });

  it("should handle UPDATE_SCRIPT_TRANSLATION", () => {
    expect(
      subtitleReducer(
        { scriptTranslation: ["text"] },
        {
          type: actionTypes.UPDATE_SCRIPT_TRANSLATION,
          index: 0,
          value: "new"
        }
      )
    ).toEqual({
      scriptTranslation: ["new"]
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

  it("should handle REMOVE_LINES", () => {
    expect(
      subtitleReducer(
        {
          timeStamp: [
            { startMs: 0, endMs: 1 },
            { startMs: 1, endMs: 2 },
            { startMs: 2, endMs: 3 },
            { startMs: 3, endMs: 4 }
          ],
          script: ["text", "text1", "text2", "text3"],
          scriptTranslation: ["text", "text1", "text2", "text3"],
          preview: ["text", "text1", "text2", "text3"],
          indexActive: 5
        },
        {
          type: actionTypes.REMOVE_LINES,
          begin: 1,
          end: 2,
          indexActive: 0
        }
      )
    ).toEqual({
      timeStamp: [
        { startMs: 0, endMs: 1 },
        { startMs: 3, endMs: 4 }
      ],
      script: ["text", "text3"],
      scriptTranslation: ["text", "text3"],
      preview: ["text", "text3"],
      indexActive: 0
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
          scriptTranslation: ["text"]
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
