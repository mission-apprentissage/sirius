import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Logo from "../assets/images/logo.svg";
import { UserContext } from "../context/UserContext";

const DsfrNavbar = () => {
  const location = useLocation();
  const [userContext] = useContext(UserContext);

  const isLandingRoute = location.pathname === "/";
  const isLoginRoute = location.pathname === "/connexion";
  const isSignupRoute = location.pathname === "/inscription";

  const quickAccessItemsLoggedIn = [
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        href: "/campagnes/gestion",
      },
      text: "Accéder à la plateforme",
    },
  ];

  const quickAccessItemsLoggedOutAndOthersRoute = [
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        href: "/connexion",
      },
      text: "Se connecter à la plateforme",
    },
  ];

  const quickAccessItemsLoggedOutAndLoginRoute = [
    {
      linkProps: {
        href: "#",
      },
      text: "Pas de compte ?",
    },
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        href: "/inscription",
      },
      text: "S'inscrire à la plateforme",
    },
  ];

  const quickAccessItemsLoggedOutAndSignupRoute = [
    {
      linkProps: {
        href: "#",
      },
      text: "Déjà inscrit ?",
    },
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        href: "/connexion",
      },
      text: "Se connecter à la plateforme",
    },
  ];

  const quickAccessItems = () => {
    if (userContext.token) {
      return quickAccessItemsLoggedIn;
    }
    if (isLandingRoute) {
      return quickAccessItemsLoggedOutAndOthersRoute;
    }
    if (isLoginRoute) {
      return quickAccessItemsLoggedOutAndLoginRoute;
    }
    if (isSignupRoute) {
      return quickAccessItemsLoggedOutAndSignupRoute;
    }

    return quickAccessItemsLoggedOutAndOthersRoute;
  };

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
      quickAccessItems={quickAccessItems()}
    />
  );
};

export default DsfrNavbar;
