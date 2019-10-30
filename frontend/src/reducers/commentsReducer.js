import {
  FETCH_COMMENTS,
  POST_COMMENT,
  REQUEST,
  FAILURE,
  SUCCESS
} from "../actions/action-types";
import {
  fetchCommentsFailure,
  fetchCommentsSuccess,
  postCommentSuccess,
  postCommentFailure
} from "../actions/index";
import store from "../store";

function makeFetchRequest(gameId) {
  fetch("http://it2810-55.idi.ntnu.no:3001/prosjekt3/api/games/" + gameId + "/comments")
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(json => {
      store.dispatch(fetchCommentsSuccess(json));
    })
    .catch(error => {
      store.dispatch(fetchCommentsFailure(error));
    });
}

function makePostRequest(gameId, comment) {
  fetch("http://it2810-55.idi.ntnu.no:3001/prosjekt3/api/games/" + gameId + "/create", {
    method: "POST",
    headers: new Headers({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      comment: comment
    })
  })
    .then(response => {
      if (response.ok) {
        store.dispatch(postCommentSuccess());
      } else {
        throw new Error(response.statusText);
      }
    })
    .catch(error => {
      store.dispatch(postCommentFailure(error));
    });
}

function commentsReducer(
  state = {
    isFetching: false,
    isPosting: false,
    comments: [],
    mostRecentGameId: null
  },
  action
) {
  if (action.type === FETCH_COMMENTS) {
    if (action.status === REQUEST) {
      if (!state.isFetching) {
        // Only fetch comments if we aren't already fetching
        makeFetchRequest(action.gameId);
        return Object.assign({}, state, {
          isFetching: true,
          fetchGameId: action.gameId,
          mostRecentGameId: action.gameId,
          error: ""
        });
      } else if (action.gameId !== state.fetchGameId) {
        // "Queue up" the request if we are already fetching something else
        return Object.assign({}, state, {
          mostRecentGameId: action.gameId
        });
      }
    } else if (action.status === FAILURE) {
      if (state.isFetching) {
        // Fetch failure: stop
        return Object.assign({}, state, {
          isFetching: false,
          fetchGameId: null,
          error: action.error
        });
      }
    } else if (action.status === SUCCESS) {
      if (state.isFetching) {
        if (state.fetchGameId === state.mostRecentGameId) {
          // Write comments to state if they are the comments we requested
          return Object.assign({}, state, {
            isFetching: false,
            comments: action.comments,
            commentsGameId: state.fetchGameId,
            fetchGameId: null,
            error: ""
          });
        } else {
          // Make a new fetch request for the new comments we want
          makeFetchRequest(state.mostRecentGameId);
          return Object.assign({}, state, {
            fetchGameId: state.mostRecentGameId
          });
        }
      }
    }
  } else if (action.type === POST_COMMENT) {
    if (action.status === REQUEST) {
      if (!state.isPosting && !state.isFetching) {
        // You can only post a comment if you are not already in the middle of a request
        makePostRequest(action.gameId, action.comment);
        return Object.assign({}, state, {
          isPosting: true,
          error: ""
        });
      }
    } else if (action.status === FAILURE) {
      if (state.isPosting) {
        return Object.assign({}, state, {
          isPosting: false,
          error: action.error
        });
      }
    } else if (action.status === SUCCESS) {
      if (state.isPosting) {
        // Reload comments after posting a comment
        makeFetchRequest(state.commentsGameId);
        return Object.assign({}, state, {
          isPosting: false,
          isFetching: true,
          mostRecentGameId: state.commentsGameId,
          error: ""
        })
      }
    }
  }
  return state;
}

export default commentsReducer;
