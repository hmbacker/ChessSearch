import {
  FETCH_GAME,
  REQUEST,
  FAILURE,
  SUCCESS
} from "../actions/action-types";
import {
  fetchGameSuccess,
  fetchGameFailure
} from "../actions/index";
import store from "../store";

function gameReducer(state = { isFetching: false }, action) {
  if (action.type === FETCH_GAME) {
    if (action.status === REQUEST) {
      if (!state.isFetching) {
        // Fetch game if we are not in the middle of another request
        fetch("http://it2810-55.idi.ntnu.no:3001/prosjekt3/api/games/" + action.id)
          .then(response => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response.statusText);
            }
          })
          .then(json => {
            try {
              store.dispatch(fetchGameSuccess(json[0]));
            } catch (e) {
            }
          })
          .catch(error => {
            store.dispatch(fetchGameFailure(error));
          });

        return Object.assign({}, state, {
          isFetching: true,
          id: action.id,
          error: ""
        });
      }
    } else if (action.status === FAILURE) {
      if (state.isFetching) {
        return Object.assign({}, state, {
          isFetching: false,
          id: null,
          error: action.error
        });
      }
    } else if (action.status === SUCCESS) {
      if (state.isFetching) {
        return Object.assign({}, state, {
          data: action.data,
          isFetching: false,
          id: action.id,
          error: ""
        });
      }
    }
  }
  return state;
}

export default gameReducer;