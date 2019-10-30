import React from "react";
import SearchPage from "../components/searchpage/SearchPage";
//import store from "../store";
import { shallow } from "enzyme";

test("renders correctly", () => {
  const wrapper = shallow(<SearchPage />);
  expect(wrapper.debug()).toMatchSnapshot();
});
