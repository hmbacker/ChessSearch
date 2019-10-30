import React, { Component } from "react";
import { fetchSearchResults, fetchMoreSearchResults } from "../../actions";
import { connect } from "react-redux";
import "./ResultBox.css";
import ResultRow from "./ResultRow";
import ResultHeaderCell from "./ResultHeaderCell";
import loadingSvg from "../../loading.svg";

const fetchMoreTriggerDistance = 150;

class ResultBox extends Component {
  constructor(props) {
    super(props);

    this.handleHeaderClick = this.handleHeaderClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleHeaderClick(headerField) {
    // Order by the field corresponding to the header clicked.
    if (Object.keys(this.props.mostRecentParamObject).length === 0) {
      // There is no "most recent param object", so we have no search to sort.
      return;
    }

    const paramObject = Object.assign({}, this.props.mostRecentParamObject, {
      offset: 0,
      limit: 25
    });

    if (this.props.mostRecentParamObject.orderby === headerField) {
      // Already ordered by headerField, so switch between ascending/descending
      paramObject.descending = !paramObject.descending;
    } else {
      // Not already ordered by headerField, make it ordered by headerField and ascending
      paramObject.orderby = headerField;
      paramObject.descending = false;
    }

    // Fetch new results with this ordering
    this.props.fetchSearchResults(paramObject);
  }

  handleScroll() {
    // Fetch more search results if we have scrolled to the bottom of the screen
    const root = document.documentElement;
    if (
      window.innerHeight + window.scrollY <
      root.scrollHeight - fetchMoreTriggerDistance
    ) {
      return;
    }
    this.props.fetchMoreSearchResults(25);
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  render() {
    const titlesAndFieldNames = [
      ["White Player", "white_id"],
      ["Rating", "white_rating"],
      ["Black Player", "black_id"],
      ["Rating", "black_rating"],
      ["Winner", "winner"],
      ["Turns", "turns"],
      ["Opening", "opening_eco"],
      ["Increment", "increment_code"],
      ["Time", "last_move_at"]
    ];
    return (
      <table className="result-box">
        <thead className="result-box-header">
          <tr>
            {titlesAndFieldNames.map(tuple => (
              <ResultHeaderCell
                key={tuple[1]}
                title={tuple[0]}
                fieldName={tuple[1]}
                paramObject={this.props.mostRecentParamObject}
                handleHeaderClick={this.handleHeaderClick}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {this.props.results.map(game => {
            return <ResultRow game={game} key={game.id} />;
          })}
          <tr>
            <td className="loading-symbol-cell" colSpan="10">
              {// If we are fetching data, show a spinny loading symbol
              this.props.isFetching ? (
                <img src={loadingSvg} alt="Loading"></img>
              ) : null}
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.searchResults.isFetching,
    mostRecentParamObject: Object.assign(
      {},
      state.searchResults.mostRecentParamObject
    ),
    results: state.searchResults.results
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchSearchResults: paramObject =>
      dispatch(fetchSearchResults(paramObject)),
    fetchMoreSearchResults: limit => dispatch(fetchMoreSearchResults(limit))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultBox);
