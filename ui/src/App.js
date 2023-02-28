import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import routes from "./routes";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <Router>
      <Switch>
        {routes.map(({ path, Component, isProtected }, key) => {
          return isProtected ? (
            <ProtectedRoute exact path={path} key={key} component={(props) => <Component {...props} />} />
          ) : (
            <Route exact path={path} key={key} component={(props) => <Component {...props} />} />
          );
        })}
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
