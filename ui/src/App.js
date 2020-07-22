import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";
import PreviewEmail from "./questionnaire/PreviewEmail";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/questionnaires/:token" component={Questionnaire} />
        <Route exact path="/questionnaires/:token/email" component={PreviewEmail} />
        <Redirect to="/questionnaire" />
      </Switch>
    </Router>
  );
}

export default App;
