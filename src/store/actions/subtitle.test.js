import configureStore from "redux-mock-store";
import thunk from "redux-thunk";
import * as actionTypes from "../actions/actionTypes";
import { removeEmptyLines, mergeToSentences } from "./subtitle";

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe("subtitle middlewares", () => {
  it("should handle removeEmptyLines", () => {
    // Initialize mockstore with empty state
    const initialState = {
      subtitle: {
        timeStamp: [
          { startMs: 0, endMs: 1 },
          { startMs: 1, endMs: 2 },
          { startMs: 2, endMs: 3 },
          { startMs: 3, endMs: 4 }
        ],
        script: ["text", "", "", "text3"],
        scriptTranslation: ["text", "text1", "text2", "text3"],
        preview: [
          { en: "text" },
          { en: "text1" },
          { en: "text2" },
          { en: "text3" }
        ],
        indexActive: 3
      }
    };
    const store = mockStore(initialState);

    // Dispatch the action
    store.dispatch(removeEmptyLines());

    // Test if your store dispatched the expected actions
    const actions = store.getActions();
    const expectedPayload = {
      type: actionTypes.UPDATE_ALL,
      timeStamp: [
        { startMs: 0, endMs: 1 },
        { startMs: 3, endMs: 4 }
      ],
      script: ["text", "text3"],
      scriptTranslation: ["text", "text3"],
      preview: [{ en: "text" }, { en: "text3" }],
      indexActive: 1
    };
    expect(actions).toEqual([expectedPayload]);
  });

  it("should handle mergeToSentences", () => {
    // Initialize mockstore with empty state
    const initialState = {
      subtitle: {
        timeStamp: [
          { startMs: 0, endMs: 1 },
          { startMs: 1, endMs: 2 },
          { startMs: 2, endMs: 3 },
          { startMs: 3, endMs: 4 }
        ],
        script: ["text", "text1", "text2", "text3"],
        scriptTranslation: ["text", "text1", "text2", "text3"],
        preview: [
          { en: "text" },
          { en: "text1" },
          { en: "text2" },
          { en: "text3" }
        ],
        indexActive: 3
      }
    };
    const store = mockStore(initialState);

    // Dispatch the action
    store.dispatch(mergeToSentences(1000));

    // Test if your store dispatched the expected actions
    const actions = store.getActions();
    const expectedPayload = {
      type: actionTypes.UPDATE_ALL,
      timeStamp: [
        { startMs: 0, endMs: 4 }
      ],
      script: ["text text1 text2 text3"],
      scriptTranslation: ["text text1 text2 text3"],
      preview: [{ en: "text text1 text2 text3" }],
      indexActive: 0
    };
    expect(actions).toEqual([expectedPayload]);
  });
});
