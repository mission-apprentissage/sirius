import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Spinner } from "@chakra-ui/react";

import { UserContext } from "./context/UserContext";
import { USER_STATUS } from "./constants";
import CguModal from "./users/CguModal";

const ProtectedRoute = () => {
  const [userContext, setUserContext] = useContext(UserContext);

  const isAuthenticated = userContext?.token;
  const isActive = userContext?.currentUserStatus === USER_STATUS.ACTIVE;
  const hasAcceptedCgu = userContext?.acceptedCgu;

  if (userContext.loading) return <Spinner />;
  if (isAuthenticated && !isActive) return <Navigate to="/compte-desactive" />;
  if (isAuthenticated && !hasAcceptedCgu)
    return <CguModal userContext={userContext} setUserContext={setUserContext} />;
  return isAuthenticated ? <Outlet /> : <Navigate to="/connexion" />;
};

export default ProtectedRoute;
