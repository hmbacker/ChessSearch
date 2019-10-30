import React from "react";
import GamePage from "../components/gamepage/GamePage";
import store from "../store";
import { shallow } from "enzyme";

test("renders correctly", () => {
  const wrapper = shallow(<GamePage store={store} />);
  expect(wrapper.debug()).toMatchSnapshot();
});
