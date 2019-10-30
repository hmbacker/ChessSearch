import React from "react";
import "./ErrorPage.css";
import knight from "../../media/search.svg";
import { Link } from "react-router-dom";

// 404 page
function GamePageError() {
  return (
    <div className="error">
      <Link className="search" to="/">
        <img src={knight} alt="white chess knight" />
      </Link>
      <p className="error-p">Page not found</p>
    </div>
  );
}
export default GamePageError;
