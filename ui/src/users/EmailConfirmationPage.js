import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import useConfirmUser from "../hooks/useConfirmUser";
import { LoginAndSignupContainer, LoginAndSignupHeader } from "./styles/shared.style";
import SiriusInTheSky from "../assets/images/sirius_in_the_sky.svg";

const EmailConfirmationPage = () => {
  const { search } = useLocation();
  const token = new URLSearchParams(search).get("token");
  const [data, loading, error] = useConfirmUser(token);

  if (!token) return <Navigate to="/campagnes/gestion" />;

  if (loading) return null;

  return (
    <LoginAndSignupContainer>
      <LoginAndSignupHeader>
        <div>
          <h5>Établissement</h5>
          {data?.success && !error ? (
            <>
              <h2>Inscription confirmée !</h2>
              <p>
                Votre adresse email a bien été confirmée. Notre équipe s’occupe de valider votre
                compte. Vous recevrez un mail dès qu’il sera activé.
              </p>
            </>
          ) : (
            <Alert
              severity="error"
              title="Une erreur s'est produite los de la validation de votre adresse email."
              description={error}
            />
          )}
        </div>
        <img src={SiriusInTheSky} alt="" />
      </LoginAndSignupHeader>
    </LoginAndSignupContainer>
  );
};

export default EmailConfirmationPage;
