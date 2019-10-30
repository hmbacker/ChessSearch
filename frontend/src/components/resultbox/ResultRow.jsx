import React from "react";
import { Link } from "react-router-dom";

function ResultRow({ game }) {
  const time = new Date(game.last_move_at);
  return (
    <tr className="result-row" key={game.id}>
      <td className="white-player-cell">{game.white_id}</td>
      <td className="white-player-rating-cell">{game.white_rating}</td>
      <td className="black-player-cell">{game.black_id}</td>
      <td className="black-player-rating-cell">{game.black_rating}</td>
      <td className="winner-cell">{game.winner}</td>
      <td className="turns-cell">{game.turns}</td>
      <td className="opening-cell">{game.opening_eco}</td>
      <td className="increment-cell">{game.increment_code}</td>
      <td className="time-cell">
        {time.toLocaleTimeString("en-GB", { hour12: false }) +
          " " +
          time.toLocaleDateString("en-GB") /* To get dd-mm-yyyy format*/}
      </td>
      <td className="more-info-cell">
        <Link to={"/game/" + game.id}>Details →</Link>
      </td>
    </tr>
  );
}

export default ResultRow;
