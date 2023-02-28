import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import routes from "./routes";
import ProtectedRoute from "./ProtectedRoute";
import { getCrumbs } from "./Components/Breadcrumbs";

function App() {
  return (
    <Router>
      <Switch>
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
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
