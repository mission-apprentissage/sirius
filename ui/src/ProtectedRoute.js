import { Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { UserContext } from "./context/UserContext";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;

  if (userContext.loading) return <Spinner />;
  return (
    <Route
      {...restOfProps}
      component={(props) => (isAuthenticated ? <Component {...props} /> : <Redirect to="/connexion" />)}
    />
  );
};

export default ProtectedRoute;
