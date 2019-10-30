// Root reducer

import { combineReducers } from "redux";
import searchResultsReducer from "./searchResultsReducer";
import gameReducer from "./gameReducer";
import commentsReducer from "./commentsReducer";

const rootReducer = combineReducers({
  searchResults: searchResultsReducer,
  game: gameReducer,
  comments: commentsReducer
});

export default rootReducer;