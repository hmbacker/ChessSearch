import React from "react";
import "./App.css";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import SearchPage from "./components/searchpage/SearchPage";
import GamePage from "./components/gamepage/GamePage";
import ErrorPage from "./components/errorpage/ErrorPage";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/" component={SearchPage} />
          <Route exact path="/game/:id" component={GamePage} />
          <Route component={ErrorPage} />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
