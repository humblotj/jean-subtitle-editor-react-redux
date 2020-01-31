import React from "react";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";

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

export default withRouter(App);
