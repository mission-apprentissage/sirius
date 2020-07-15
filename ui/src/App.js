import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";
import Emails from "./Emails";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/questionnaire" component={Questionnaire} />
        <Route exact path="/emails/:template" component={Emails} />
        <Redirect to="/questionnaire" />
      </Switch>
    </Router>
  );
}

export default App;
