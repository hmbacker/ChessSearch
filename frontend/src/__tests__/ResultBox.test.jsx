import React from "react";
import ResultBox from "../components/resultbox/ResultBox";
import { shallow } from "enzyme";
import store from "../store";

test("renders correctly", () => {
  const wrapper = shallow(<ResultBox store={store} />);
  expect(wrapper.debug()).toMatchSnapshot();
});
