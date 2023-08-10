import { Spinner } from "@chakra-ui/react";
import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "./context/UserContext";
import { STATUS } from "./constants";

const ProtectedRoute = () => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;
  const isActive = userContext?.currentUserStatus === STATUS.ACTIVE;

  if (userContext.loading) return <Spinner />;
  if (userContext.token && !isActive) return <Navigate to="/compte-desactive" />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/connexion" />;
};

export default ProtectedRoute;
