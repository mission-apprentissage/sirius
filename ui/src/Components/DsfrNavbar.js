import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Logo from "../assets/images/logo.svg";
import { UserContext } from "../context/UserContext";
import { useGet } from "../common/hooks/httpHooks";

const DsfrNavbar = () => {
  const location = useLocation();
  const [userContext] = useContext(UserContext);
  const [questionnaires] = useGet(`/api/questionnaires/`);

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const isLandingRoute = location.pathname === "/";
  const isLoginRoute = location.pathname === "/connexion";
  const isSignupRoute = location.pathname === "/inscription";
  const isLoggedIn = userContext.token;

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

  const quickAccessItemsLoggedIn = [
    {
      iconId: "fr-icon-eye-fill",
      linkProps: {
        href: `/questionnaires/${
          validatedQuestionnaire?.length && validatedQuestionnaire[0]._id
        }/apercu`,
      },
      text: "Aperçu du questionnaire",
    },
    {
      iconId: "fr-icon-information-fill",
      linkProps: {
        href: `#`,
      },
      text: "Guide de diffusion",
    },
    {
      iconId: "fr-icon-add-line",
      linkProps: {
        href: `/campagnes/ajout`,
      },
      text: "Créer des campagnes",
    },
  ];

  const quickAccessItems = () => {
    if (isLandingRoute) {
      return quickAccessItemsLoggedOutAndOthersRoute;
    }
    if (isLoginRoute) {
      return quickAccessItemsLoggedOutAndLoginRoute;
    }
    if (isSignupRoute) {
      return quickAccessItemsLoggedOutAndSignupRoute;
    }
    if (isLoggedIn) {
      return quickAccessItemsLoggedIn;
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
