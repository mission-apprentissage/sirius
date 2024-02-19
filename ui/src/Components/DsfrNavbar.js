import React, { useContext } from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Logo from "../assets/images/logo.svg";
import { UserContext } from "../context/UserContext";

const DsfrNavbar = () => {
  const [userContext] = useContext(UserContext);

  return (
    <Header
      brandTop={
        <>
          RÉPUBLIQUE
          <br />
          FRANÇAISE
        </>
      }
      homeLinkProps={{
        href: "/",
        title: "Accueil - Sirius",
      }}
      operatorLogo={{
        alt: "Logo Sirius",
        imgUrl: Logo,
        orientation: "horizontal",
      }}
      quickAccessItems={[
        userContext.token
          ? {
              iconId: "fr-icon-account-circle-fill",
              linkProps: {
                href: "/campagnes/gestion",
              },
              text: "Accéder à la plateforme",
            }
          : {
              iconId: "fr-icon-account-circle-fill",
              linkProps: {
                href: "/connexion",
              },
              text: "Se connecter à la plateforme",
            },
      ]}
    />
  );
};

export default DsfrNavbar;
