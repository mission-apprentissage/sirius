import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Questionnaire from "./questionnaire/Questionnaire";

import PreviewEmail from "./questionnaire/PreviewEmail";
import Home from "./Home";
import routes from "./routes";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        {routes.map(({ path, Component }, key) => (
          <Route
            exact
            path={path}
            key={key}
            component={(props) => {
              const crumbs = routes
                .filter(({ path }) => props.match.path.includes(path))
                .map(({ path, ...rest }) => ({
                  path: Object.keys(props.match.params).length
                    ? Object.keys(props.match.params).reduce(
                        (path, param) => path.replace(`:${param}`, props.match.params[param]),
                        path
                      )
                    : path,
                  ...rest,
                }));
              return <Component {...props} crumbs={crumbs} />;
            }}
          />
        ))}
        <Route exact path="/questionnaires/:token" component={Questionnaire} />
        <Route exact path="/questionnaires/:token/previewEmail" component={PreviewEmail} />
        <Redirect to="/" />
      </Switch>
    </Router>
  );
}

export default App;
