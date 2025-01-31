import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Support from "../assets/images/support.svg";
import { USER_STATUS } from "../constants";
import { UserContext } from "../context/UserContext";
import useSetAndTrackPageTitle from "../hooks/useSetAndTrackPageTitle";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";

const PendingAccountPage = () => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  const helmet = useSetAndTrackPageTitle({ title: `Compte en attente - Sirius` });

  if (userContext.user?.status === USER_STATUS.ACTIVE) {
    navigate("/");
  }

  return (
    <>
      {helmet}
      <LoginAndSignupContainer>
        <LoginAndSignupHeader>
          <div>
            <h5>Établissement</h5>
            <h2>Compte en attente</h2>
            <p>Votre compte est en cours de validation, un email vous sera envoyé une fois votre demande confirmée.</p>
          </div>
          <img src={Support} alt="" />
        </LoginAndSignupHeader>
      </LoginAndSignupContainer>
    </>
  );
};

export default PendingAccountPage;
