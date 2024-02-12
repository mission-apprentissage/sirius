import React from "react";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Logo from "../assets/images/logo.svg";

const UnauthNavbar = () => {
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
        {
          iconId: "fr-icon-account-circle-fill",
          linkProps: {
            href: "/inscription",
          },
          text: "S'inscrire",
        },
        {
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

export default UnauthNavbar;
