import React, { useState } from "react";
import { fetchSearchResults } from "../../actions";
import { connect } from "react-redux";
import "./SearchBox.css";

function SearchBox(props) {
  // Adapt UI labels to meaningful names, depending on if "Ignore colors" is checked or not.
  const [ignoreColors, setIgnoreColors] = useState(false);
  function handleICChange(event) {
    setIgnoreColors(event.target.checked);
  }

  // Ensure only 0 or 1 winner results can be checked
  function handleWinnerChange(event) {
    const checkboxId = event.target.id;
    if (event.target.checked) {
      if (checkboxId !== "whitewin") {
        document.getElementById("whitewin").checked = false;
      }
      if (checkboxId !== "blackwin") {
        document.getElementById("blackwin").checked = false;
      }
      if (checkboxId !== "draw") {
        document.getElementById("draw").checked = false;
      }
    }
  }

  function handleSubmit(event) {
    // On submit, start a search request with the given form data.
    event.preventDefault();
    const formData = new FormData(event.target);
  
    let winner = "";
    if (formData.get("whitewin") === "on") {
      winner = "w";
    } else if (formData.get("blackwin") === "on") {
      winner = "b";
    } else if (formData.get("draw") === "on") {
      winner = "d";
    }
  
    const paramObject = {
      playerw: formData.get("whiteplayername"),
      playerb: formData.get("blackplayername"),
      ignorecolors: formData.get("ignorecolors") === "on" ? true : false,
      winner: winner,
      datemin: formData.get("fromdate"),
      datemax: formData.get("todate"),
      ratingmin: formData.get("minrating"),
      ratingmax: formData.get("maxrating"),
      eco: formData.get("openingecocode"),
      turnmin: formData.get("minturns"),
      turnmax: formData.get("maxturns"),
      orderby: "id",
      descending: false,
      offset: 0,
      limit: 25
    };
    
    props.fetchSearchResults(paramObject);
  }

  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <div className="fieldset-flexbox">
        <fieldset className="player">
          <legend>Player names</legend>
          <div className="field-container">
            <label htmlFor="whiteplayername">
              {ignoreColors ? "Player 1" : "White Player"}
            </label>
            <input
              type="text"
              name="whiteplayername"
              id="whiteplayername"
              placeholder="User ID"
            ></input>
          </div>
          <div className="field-container">
            <label htmlFor="blackplayername">
              {ignoreColors ? "Player 2" : "Black Player"}
            </label>
            <input
              type="text"
              name="blackplayername"
              id="blackplayername"
              placeholder="User ID"
            ></input>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="ignorecolors"
              id="ignorecolors"
              onClick={handleICChange}
            ></input>
            <label htmlFor="ignorecolors">Ignore colors</label>
          </div>
        </fieldset>
        <fieldset className="victory">
          <legend>Winner</legend>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="whitewin"
              id="whitewin"
              onClick={handleWinnerChange}
            ></input>
            <label htmlFor="whitewin">White</label>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="blackwin"
              id="blackwin"
              onClick={handleWinnerChange}
            ></input>
            <label htmlFor="blackwin">Black</label>
          </div>
          <div className="checkbox-container">
            <input
              type="checkbox"
              name="draw"
              id="draw"
              onClick={handleWinnerChange}
            ></input>
            <label htmlFor="draw">Draw</label>
          </div>
        </fieldset>
        <fieldset className="time">
          <legend>Game time range</legend>
          <div className="field-container">
            <label htmlFor="fromdate">From</label>
            <input type="date" name="fromdate" id="fromdate"></input>
          </div>
          <div className="field-container">
            <label htmlFor="todate">To</label>
            <input type="date" name="todate" id="todate"></input>
          </div>
        </fieldset>
        <fieldset className="ratings">
          <legend>Player ratings</legend>
          <div className="field-container">
            <label htmlFor="minrating">Min</label>
            <input type="number" name="minrating" id="minrating"></input>
          </div>
          <div className="field-container">
            <label htmlFor="maxrating">Max</label>
            <input type="number" name="maxrating" id="maxrating"></input>
          </div>
        </fieldset>
        <fieldset className="opening">
          <legend>Opening</legend>
          <div className="field-container">
            <label htmlFor="openingecocode">ECO code</label>
            <input type="text" name="openingecocode" id="openingecode"></input>
          </div>
        </fieldset>
        <fieldset className="turns">
          <legend>Number of turns</legend>
          <div className="field-container">
            <label htmlFor="minturns">Min</label>
            <input type="number" name="minturns" id="minturns"></input>
          </div>
          <div className="field-container">
            <label htmlFor="maxturns">Max</label>
            <input type="number" name="maxturns" id="maxturns"></input>
          </div>
        </fieldset>
      </div>
      <fieldset className="submit">
        <button type="submit">Search</button>
      </fieldset>
    </form>
  );
}

function mapDispatchToProps(dispatch) {
  return ({
    fetchSearchResults: paramObject => dispatch(fetchSearchResults(paramObject))
  });
}

export default connect(null, mapDispatchToProps)(SearchBox);
