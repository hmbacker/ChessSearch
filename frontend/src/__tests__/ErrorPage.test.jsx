import React from "react";
import ErrorPage from "../components/errorpage/ErrorPage";
import { shallow } from "enzyme";

test("renders correctly", () => {
  const wrapper = shallow(<ErrorPage />);
  expect(wrapper.debug()).toMatchSnapshot();
});
