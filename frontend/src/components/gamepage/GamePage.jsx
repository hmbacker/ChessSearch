import React from "react";
import "./GamePage.css";
import search from "../../media/search.svg";
import { Link } from "react-router-dom";
import { fetchGame } from "../../actions";
import { connect } from "react-redux";
import CommentBox from "../commentBox/CommentBox";

function GamePage({ game, match, fetchGame }) {
  const {
    params: { id }
  } = match;
  const empty_game = {
    black_id: null,
    black_rating: null,
    created_at: null,
    id: null,
    increment_code: null,
    last_move_at: null,
    moves: null,
    opening_eco: null,
    opening_name: null,
    opening_ply: null,
    rated: null,
    turns: null,
    victory_status: null,
    white_id: null,
    white_rating: null,
    winner: null
  };

  if (!game || game.id !== id) {
    // Load the game info if we do not have it in store
    fetchGame(id);
    game = empty_game; // Render an empty game instead
  }
  const start_time = new Date(game.created_at);
  const end_time = new Date(game.last_move_at);
  const duration = (end_time - start_time) / 60000;

  const isWinner = <font color="yellow">winner</font>;

  let move_list = !game.moves ? null : game.moves.split(" ");
  let newMoveList = [];

  // Convert move_list to a readable format (e.g. ["e4", "e5"] => ["1. e4 e5"])
  if (move_list) {
    for (let i = 1; i * 2 - 1 < move_list.length; i++) {
      newMoveList.push(
        i.toString() + ". " + move_list[i * 2 - 2] + " " + move_list[i * 2 - 1]
      );
    }
    if (move_list.length % 2 === 1) {
      newMoveList.push(
        ((move_list.length + 1) / 2).toString() +
          ". " +
          move_list[move_list.length - 1]
      );
    }
  }

  return (
    <div className="gamepage">
      <header className="gamepage-header">
        <Link className="home" to="/">
          <img src={search} className="search" alt="white chess knight" />
        </Link>
        <h2>Detailed Game Information</h2>
      </header>
      <section className="gamepage-section">
        <div className="gamepage-section-text">
          <p>
            <b>White Player: </b>
            {game.white_id} {game.winner === "white" ? isWinner : ""}
          </p>
          <p>
            <b>Black Player: </b>
            {game.black_id} {game.winner === "black" ? isWinner : ""}
          </p>
          <p>
            <b>Date: </b>
            {start_time.toLocaleDateString(
              "en-GB"
            ) /* To get dd-mm-yyyy format*/}
          </p>
          <p>
            <b>Started at: </b>{" "}
            {start_time.toLocaleTimeString("en-GB", { hour12: false })}
          </p>
          <p>
            <b>Ended at: </b>{" "}
            {end_time.toLocaleTimeString("en-GB", { hour12: false })}
          </p>
          <p>
            <b>Duration: </b>
            {Math.round(duration)} minutes
          </p>
          <p>
            <b>Ratings: </b>
            <font color="yellow">{game.white_rating}</font>(white){" "}
            <font color="yellow">{game.black_rating}</font>
            (black)
          </p>
          <p>
            <b>Turns: </b>
            {game.turns}
          </p>
          <p>
            <b>Opening: </b>
            <font color="yellow">{game.opening_eco}</font> - {game.opening_name}
          </p>
          <p>
            <b>Opening Plies: </b>
            {game.opening_ply}
          </p>
          <p>
            <b>Victory Status: </b>
            {game.victory_status}
          </p>
        </div>

        <div className="gamepage-section-moves">
          <div className="gamepage-section-moves-h">
            <b>Moves:</b>
          </div>
          <div className="gamepage-section-moves-t">
            {newMoveList.map((move, index) => {
              return <div className="gamepage-section-moves-move" key={index}>{move}</div>;
            })}
          </div>
        </div>
        <CommentBox id={id}/>
      </section>
      <footer className="gamepage-footer"></footer>
    </div>
  );
}

function mapDispatchToProps(dispatch) {
  return {
    fetchGame: id => dispatch(fetchGame(id))
  };
}

function mapStateToProps(state, ownProps) {
  return {
    game: state.game.data,
    match: ownProps.match
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GamePage);
