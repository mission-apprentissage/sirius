import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";
import { UserContext } from "../context/UserContext";
import { USER_STATUS } from "../constants";
import Support from "../assets/images/support.svg";

const PendingAccountPage = () => {
  const [userContext] = useContext(UserContext);
  const navigate = useNavigate();

  if (userContext.user?.status === USER_STATUS.ACTIVE) {
    navigate("/");
  }

  return (
    <LoginAndSignupContainer>
      <LoginAndSignupHeader>
        <div>
          <h5>Établissement</h5>
          <h2>Compte en attente</h2>
          <p>
            Votre compte est en cours de validation, un email vous sera envoyé une fois votre
            demande confirmée.
          </p>
        </div>
        <img src={Support} alt="" />
      </LoginAndSignupHeader>
    </LoginAndSignupContainer>
  );
};

export default PendingAccountPage;
