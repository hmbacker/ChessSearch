// Main action generator file

import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  FETCH_COMMENTS,
  POST_COMMENT,
  FETCH_GAME,
  REQUEST,
  FAILURE,
  SUCCESS
} from "./action-types";

// fetchSearchResults: retrieve a new set of results from the server, given the search parameters in paramObject
// Make request
export function fetchSearchResults(paramObject) {
  return {
    type: FETCH_SEARCH_RESULTS,
    paramObject: paramObject,
    status: REQUEST
  };
}

// Request failure
export function fetchSearchResultsFailure(error) {
  return {
    type: FETCH_SEARCH_RESULTS,
    status: FAILURE,
    error: error
  };
}

// Request success
export function fetchSearchResultsSuccess(results) {
  return {
    type: FETCH_SEARCH_RESULTS,
    status: SUCCESS,
    results: results
  };
}

// fetchMoreSearchResults: fetch the next [limit] results for the current search and add them to our results
// Make request
export function fetchMoreSearchResults(limit) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    status: REQUEST,
    limit: limit
  };
}

// Request failure
export function fetchMoreSearchResultsFailure(error) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    status: FAILURE,
    error: error
  };
}

// Request success
export function fetchMoreSearchResultsSuccess(results) {
  return {
    type: FETCH_MORE_SEARCH_RESULTS,
    status: SUCCESS,
    results: results
  };
}

// fetchComments: load the comments for a given game
// Make request
export function fetchComments(gameId) {
  return {
    type: FETCH_COMMENTS,
    status: REQUEST,
    gameId: gameId
  };
}

export function fetchCommentsFailure(error) {
  return {
    type: FETCH_COMMENTS,
    status: FAILURE,
    error: error
  };
}

export function fetchCommentsSuccess(comments) {
  return {
    type: FETCH_COMMENTS,
    status: SUCCESS,
    comments: comments
  };
}

// postComment: add a comment to a game's comment section
// Make request
export function postComment(gameId, comment) {
  return {
    type: POST_COMMENT,
    status: REQUEST,
    gameId: gameId,
    comment: comment
  };
}

// Request failure
export function postCommentFailure(error) {
  return {
    type: POST_COMMENT,
    status: FAILURE,
    error: error
  };
}

// Request success
export function postCommentSuccess() {
  return {
    type: POST_COMMENT,
    status: SUCCESS
  };
}

// fetchGame: fetch the data of the game with the given id
// Make request
export function fetchGame(id) {
  return {
    type: FETCH_GAME,
    status: REQUEST,
    id: id
  };
}

// Request failure
export function fetchGameFailure(error) {
  return {
    type: FETCH_GAME,
    status: FAILURE,
    error: error
  };
}

// Request success
export function fetchGameSuccess(data) {
  return {
    type: FETCH_GAME,
    status: SUCCESS,
    data: data
  };
}
