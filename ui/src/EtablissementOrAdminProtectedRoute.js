import styled from "@emotion/styled";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import BeatLoader from "react-spinners/BeatLoader";

import { USER_ROLES, USER_STATUS } from "./constants";
import { UserContext } from "./context/UserContext";
import CguModal from "./users/CguModal";

const LoaderContainer = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 45vh;
`;

const EtablissementOrAdminProtectedRoute = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const isAuthenticated = userContext.token;
  const isActive = userContext.user?.status === USER_STATUS.ACTIVE;
  const hasAcceptedCgu = userContext.user?.acceptedCgu;
  const isAdminOrEtablissement =
    userContext.user?.role === USER_ROLES.ADMIN || userContext.user?.role === USER_ROLES.ETABLISSEMENT;

  if (userContext.loading)
    return (
      <LoaderContainer>
        <BeatLoader color="var(--background-action-high-blue-france)" size={20} aria-label="Loading Spinner" />
      </LoaderContainer>
    );
  if (isAuthenticated && !isActive) return <Navigate to="/compte-desactive" />;
  if (isAuthenticated && !hasAcceptedCgu) return <CguModal userContext={userContext} setUserContext={setUserContext} />;
  return isAuthenticated && isAdminOrEtablissement ? <Outlet /> : <Navigate to="/" />;
};

export default EtablissementOrAdminProtectedRoute;
