import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "@codegouvfr/react-dsfr/Header";
import Logo from "../assets/images/logo.svg";
import { UserContext } from "../context/UserContext";
import { useGet } from "../common/hooks/httpHooks";
import { _get } from "../utils/httpClient";
import { USER_ROLES } from "../constants";

const DsfrNavbar = () => {
  const location = useLocation();
  const [userContext] = useContext(UserContext);
  const [questionnaires] = useGet(`/api/questionnaires/`);
  const navigate = useNavigate();

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await _get(`/api/users/logout`, userContext.token);
    if (result.success) {
      navigate(0);
    }
  };

  const isLandingRoute = location.pathname === "/";
  const isLoginRoute = location.pathname === "/connexion";
  const isSignupRoute = location.pathname === "/inscription";
  const manageCampagnesRoute = location.pathname === "/campagnes/gestion";
  const addCampagnesRoute = location.pathname === "/campagnes/ajout";
  const campagnesResultsRoute = location.pathname === "/campagnes/resultats";

  const isLoggedIn = !!userContext.token;
  const isAdmin = userContext.user?.role === USER_ROLES.ADMIN;
  const isObserver = userContext.user?.role === USER_ROLES.OBSERVER;

  const quickAccessItemsLoggedOutAndOthersRoute = [
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        to: "/connexion",
      },
      text: "Se connecter à la plateforme",
    },
  ];

  const quickAccessItemsLoggedOutAndLoginRoute = [
    {
      linkProps: {
        to: "#",
      },
      text: "Pas de compte ?",
    },
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        to: "/inscription",
      },
      text: "S'inscrire à la plateforme",
    },
  ];

  const quickAccessItemsLoggedOutAndSignupRoute = [
    {
      linkProps: {
        to: "#",
      },
      text: "Déjà inscrit ?",
    },
    {
      iconId: "fr-icon-account-circle-fill",
      linkProps: {
        to: "/connexion",
      },
      text: "Se connecter à la plateforme",
    },
  ];

  const quickAccessItemsLoggedIn = [
    {
      iconId: "fr-icon-eye-fill",
      linkProps: {
        to: `/questionnaires/${
          validatedQuestionnaire?.length && validatedQuestionnaire[0]._id
        }/apercu`,
      },
      text: "Aperçu du questionnaire Sirius",
    },
    {
      iconId: "fr-icon-information-fill",
      linkProps: {
        to: `/guide-diffusion`,
      },
      text: "Guide de diffusion",
    },
    {
      linkProps: {},
      text: `${userContext.user?.firstName} ${userContext.user?.lastName}`,
    },
    {
      iconId: "fr-icon-logout-box-r-fill",
      linkProps: {
        to: `/`,
        onClick: (e) => handleLogout(e),
      },
      text: "",
    },
  ];

  const observerNavigation = [
    {
      linkProps: {
        to: "/campagnes/resultats",
      },
      text: "Voir les témoignages",
      isActive: campagnesResultsRoute,
    },
  ];

  const etablissementNavigation = [
    {
      linkProps: {
        to: "/campagnes/gestion",
      },
      text: "Diffuser mes campagnes",
      isActive: manageCampagnesRoute,
    },
    {
      linkProps: {
        to: "/campagnes/ajout",
      },
      text: "Créer des campagnes",
      isActive: addCampagnesRoute,
    },
    {
      linkProps: {
        to: "/campagnes/resultats",
      },
      text: "Voir les témoignages",
      isActive: campagnesResultsRoute,
    },
  ];

  const adminNavigation = [
    ...etablissementNavigation,
    {
      text: "Gestion",
      menuLinks: [
        {
          linkProps: {
            to: "/temoignages/gestion",
          },
          text: "Gérer les témoignages",
        },
        {
          linkProps: {
            to: "/utilisateurs/gestion",
          },
          text: "Gérer les utilisateurs",
        },
        {
          linkProps: {
            to: "/verbatims/moderation",
          },
          text: "Modération des verbatims",
        },
      ],
    },
    {
      text: "Suivi",
      menuLinks: [
        {
          linkProps: {
            to: "/suivi/etablissements",
          },
          text: "Établissements",
        },
        {
          linkProps: {
            to: "/utilisateurs/campagnes",
          },
          text: "Campagnes",
        },
      ],
    },
  ];

  const quickAccessItems = () => {
    if (isLoggedIn) {
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

  const navigation = () => {
    if (isObserver) {
      return observerNavigation;
    }
    if (isAdmin) {
      return adminNavigation;
    }
    if (isLoggedIn) {
      return etablissementNavigation;
    }
  };

  const homeLink = () => {
    if (isObserver) {
      return "/campagnes/resultats";
    }
    if (isLoggedIn) {
      return "/campagnes/gestion";
    }
    return "/";
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
        to: homeLink(),
        title: "Accueil - Sirius",
      }}
      operatorLogo={{
        alt: "Logo Sirius",
        imgUrl: Logo,
        orientation: "horizontal",
      }}
      quickAccessItems={quickAccessItems()}
      navigation={navigation()}
    />
  );
};

export default DsfrNavbar;
