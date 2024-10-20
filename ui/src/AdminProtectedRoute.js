import { Spinner } from "@chakra-ui/react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { USER_ROLES, USER_STATUS } from "./constants";
import { UserContext } from "./context/UserContext";

const AdminProtectedRoute = () => {
  const [userContext] = useContext(UserContext);
  const isAuthenticated = userContext?.token;
  const isActive = userContext.user?.status === USER_STATUS.ACTIVE;
  const isAdmin = userContext.user?.role === USER_ROLES.ADMIN;

  if (userContext.loading) return <Spinner />;
  if (userContext.token && !isActive) return <Navigate to="/compte-desactive" />;
  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminProtectedRoute;
