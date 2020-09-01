import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";
import PreviewEmail from "./questionnaire/PreviewEmail";
import Home from "./Home";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/questionnaires/:token" component={Questionnaire} />
        <Route exact path="/questionnaires/:token/previewEmail" component={PreviewEmail} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
