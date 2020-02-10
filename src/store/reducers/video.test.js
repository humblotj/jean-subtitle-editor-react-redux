import videoReducer, { initialState } from "./video";
import * as actionTypes from "../actions/actionTypes";

describe("subtitle reducer", () => {
  it("should return the initial state", () => {
    expect(videoReducer(undefined, {})).toEqual(initialState);
  });

  it("should handle VIDEO_SELECTED", () => {
    expect(
      videoReducer(
        { videoId: "123", videoType: "", url: "", rate: 2 },
        {
          type: actionTypes.VIDEO_SELECTED,
          videoType: "videoType",
          url: "url"
        }
      )
    ).toEqual({
      videoId: "",
      videoType: "videoType",
      url: "url",
      rate: 1
    });
  });

  it("should handle YT_PLAYED", () => {
    expect(
      videoReducer(
        { videoId: "", videoType: "", url: "", rate: 2 },
        {
          type: actionTypes.YT_PLAYED,
          videoId: "123",
          url: "url"
        }
      )
    ).toEqual({
      videoId: "123",
      videoType: "video/mp4",
      url: "url",
      rate: 1
    });
  });

  it("should handle SET_YOUTUBE_LINK", () => {
    expect(
      videoReducer(
        { youtubeLink: "" },
        {
          type: actionTypes.SET_YOUTUBE_LINK,
          youtubeLink: "link"
        }
      )
    ).toEqual({
      youtubeLink: "link"
    });
  });

  it("should handle SET_PAUSE", () => {
    expect(
      videoReducer(
        { paused: false },
        {
          type: actionTypes.SET_PAUSE,
          pause: true
        }
      )
    ).toEqual({
      paused: true
    });
  });

  it("should handle SET_VOLUME", () => {
    expect(
      videoReducer(
        { audioVolume: 1 },
        {
          type: actionTypes.SET_VOLUME,
          audioVolume: 0.5
        }
      )
    ).toEqual({
      audioVolume: 0.5
    });
  });
});
