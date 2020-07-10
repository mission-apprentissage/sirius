import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/questionnaire" component={Questionnaire} />
        <Redirect to="/questionnaire" />
      </Switch>
    </Router>
  );
}

export default App;
