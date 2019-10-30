import React from "react";
import "./SearchPage.css";
import chess_pieces from "../../media/chess_pieces.svg";
import SearchBox from "../searchbox/SearchBox";
import ResultBox from "../resultbox/ResultBox";
import Graph from '../advancedview/Graph'

function SearchPage() {
  return (
    <div className="searchpage">
      <header className="searchpage-header">
        <h1>Chess Search</h1>
      </header>
      <section className="searchpage-section">
        <img
          src={chess_pieces}
          className="image-chess"
          alt="white chess knight"
        />
        <SearchBox />
        <Graph />
        <ResultBox />
      </section>
      <footer className="searchpage-footer">
        <div>
          Loading icon made by{" "}
          <a
            href="https://www.flaticon.com/authors/roundicons"
            title="Roundicons"
            target="_blank"
            rel="noopener noreferrer"
          >
            Roundicons
          </a>{" "}
          from{" "}
          <a
            href="https://www.flaticon.com/"
            title="Flaticon"
            target="_blank"
            rel="noopener noreferrer"
          >
            www.flaticon.com
          </a>
        </div>
      </footer>
    </div>
  );
}

export default SearchPage;
