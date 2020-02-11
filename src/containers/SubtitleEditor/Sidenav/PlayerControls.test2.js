import React from "react";

import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import { PlayerControls } from "./PlayerControls";
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon
} from "@material-ui/icons";

configure({ adapter: new Adapter() });

describe("<PlayerControls />", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<PlayerControls />);
  });

  it("should render PauseIcon when paused", () => {
    wrapper.setProps({ paused: false });
    expect(wrapper.find(PauseIcon)).toHaveLength(1);
  });

  it("should render PlayIcon when not pause", () => {
    wrapper.setProps({ paused: true });
    expect(wrapper.find(PlayArrowIcon)).toHaveLength(1);
  });
});
