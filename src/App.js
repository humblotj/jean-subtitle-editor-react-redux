import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { hot } from "react-hot-loader";

import "./App.css";
import SubtitleEditor from "./containers/SubtitleEditor/SubtitleEditor";

function App() {
  return (
    <Switch>
      <Route path="/" exact component={SubtitleEditor} />
      <Redirect to="/" />
    </Switch>
  );
}

export default process.env.NODE_ENV === "development" ? hot(module)(App) :(App);
