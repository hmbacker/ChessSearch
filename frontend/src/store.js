// This is the store! We likely will not have to change this file throughout the whole project :)

import { createStore } from "redux";
import rootReducer from "./reducers/index";

const store = createStore(rootReducer);

export default store;
