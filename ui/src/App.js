import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";

import PreviewEmail from "./questionnaire/PreviewEmail";
import Home from "./Home";
import routes from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import { getCrumbs } from "./Components/Breadcrumbs";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {routes.map(({ path, Component, isProtected }, key) => {
          return isProtected ? (
            <ProtectedRoute
              exact
              path={path}
              key={key}
              component={(props) => <Component {...props} crumbs={getCrumbs(props)} />}
            />
          ) : (
            <Route
              exact
              path={path}
              key={key}
              component={(props) => <Component {...props} crumbs={getCrumbs(props)} />}
            />
          );
        })}
        <Route exact path="/questionnaires/:token" component={Questionnaire} />
        <Route exact path="/questionnaires/:token/previewEmail" component={PreviewEmail} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
