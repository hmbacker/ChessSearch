import {
  FETCH_SEARCH_RESULTS,
  FETCH_MORE_SEARCH_RESULTS,
  REQUEST,
  FAILURE,
  SUCCESS
} from "../actions/action-types";
import {
  fetchSearchResultsFailure,
  fetchSearchResultsSuccess,
  fetchMoreSearchResultsFailure,
  fetchMoreSearchResultsSuccess
} from "../actions/index";
import store from "../store";

function paramObjectToParamString(paramObject) {
  return (
    "?playerw=" +
    paramObject.playerw +
    "&playerb=" +
    paramObject.playerb +
    "&ignorecolors=" +
    paramObject.ignorecolors +
    "&winner=" +
    paramObject.winner +
    "&datemin=" +
    paramObject.datemin +
    "&datemax=" +
    paramObject.datemax +
    "&ratingmin=" +
    paramObject.ratingmin +
    "&ratingmax=" +
    paramObject.ratingmax +
    "&eco=" +
    paramObject.eco +
    "&turnmin=" +
    paramObject.turnmin +
    "&turnmax=" +
    paramObject.turnmax +
    "&orderby=" +
    paramObject.orderby +
    "&descending=" +
    paramObject.descending +
    "&offset=" +
    paramObject.offset +
    "&limit=" +
    paramObject.limit
  );
}

function makeFetchRequest(paramString, more = false) {
  fetch("http://it2810-55.idi.ntnu.no:3001/prosjekt3/api/games" + paramString)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.statusText);
      }
    })
    .then(json => {
      if (!more) {
        store.dispatch(fetchSearchResultsSuccess(json));
      } else {
        store.dispatch(fetchMoreSearchResultsSuccess(json));
      }
    })
    .catch(error => {
      if (!more) {
        store.dispatch(fetchSearchResultsFailure(error));
      } else {
        store.dispatch(fetchMoreSearchResultsFailure(error));
      }
    });
}

function searchResultsReducer(
  state = { results: [], isFetching: false, mostRecentCall: null },
  action
) {
  if (action.type === FETCH_SEARCH_RESULTS) {
    if (action.status === REQUEST) {
      // Fetch results if we are not in the middle of another request
      if (!state.isFetching) {
        const paramString = paramObjectToParamString(action.paramObject);
        makeFetchRequest(paramString);
        return Object.assign({}, state, {
          isFetching: true,
          fetchParamObject: action.paramObject,
          mostRecentParamObject: action.paramObject,
          error: ""
        });
      } else if (action.paramObject !== state.fetchParamObject) {
        // If we are already handling a fetch request, and this call wants a different set of data:
        // Remember the call so we can make the fetch later
        return Object.assign({}, state, {
          mostRecentParamObject: action.paramObject
        });
      }
    } else if (action.status === FAILURE) {
      if (state.isFetching) {
        return Object.assign({}, state, {
          isFetching: false,
          fetchParamObject: null,
          error: action.error
        });
      }
    } else if (action.status === SUCCESS) {
      if (state.isFetching) {
        if (
          paramObjectToParamString(state.mostRecentParamObject) ===
          paramObjectToParamString(state.fetchParamObject)
        ) {
          // If no other calls for new searches have been made during the request, add results to state
          return Object.assign({}, state, {
            results: action.results[0],
            resultsParamObject: state.fetchParamObject,
            fetchParamObject: null,
            isFetching: false,
            resultsComplete: false,
            error: "",
            graphData: action.results[1]
          });
        } else {
          // If the received data does not match the most recently requested data:
          // Do not update results, instead make a new call for the new data set
          makeFetchRequest(
            paramObjectToParamString(state.mostRecentParamObject)
          );
          return Object.assign({}, state, {
            fetchParamObject: state.mostRecentParamObject
          });
        }
      }
    }
  } else if (action.type === FETCH_MORE_SEARCH_RESULTS) {
    if (action.status === REQUEST) {
      if (
        // Fetch the next chunk of results if
        !state.isFetching && // - we are not processing another request
        state.resultsParamObject && // - we have a search request to retrieve more results for
        !state.resultsComplete // - we have not already retrieved all results
      ) {
        const paramObject = Object.assign({}, state.resultsParamObject);
        paramObject.offset += paramObject.limit;
        paramObject.limit = action.limit;
        const paramString = paramObjectToParamString(paramObject);
        makeFetchRequest(paramString, true);
        return Object.assign({}, state, {
          isFetching: true,
          fetchParamObject: paramObject,
          mostRecentParamObject: paramObject,
          mostRecentQuery: paramString,
          error: ""
        });
      }
    } else if (action.status === FAILURE) {
      if (state.isFetching) {
        return Object.assign({}, state, {
          isFetching: false,
          fetchParamObject: null,
          error: action.error
        });
      }
    } else if (action.status === SUCCESS) {
      if (state.isFetching) {
        if (
          paramObjectToParamString(state.mostRecentParamObject) ===
          paramObjectToParamString(state.fetchParamObject)
        ) {
          // If no other calls for new searches have been made during the request, add results to state
          return Object.assign({}, state, {
            results: state.results.concat(action.results[0]),
            resultsParamObject: state.fetchParamObject,
            fetchParamObject: null,
            isFetching: false,
            resultsComplete: action.results[0] < state.fetchParamObject.limit, // If we received less results than we requested, we have received all results
            error: ""
          });
        }
      }
    }
  }
  return state;
}

export default searchResultsReducer;
