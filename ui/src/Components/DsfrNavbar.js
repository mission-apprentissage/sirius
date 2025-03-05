import Alert from "@codegouvfr/react-dsfr/Alert";
import { Header } from "@codegouvfr/react-dsfr/Header";
import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Logo from "../assets/images/logo.svg";
import { useGet } from "../common/hooks/httpHooks";
import { USER_ROLES } from "../constants";
import { UserContext } from "../context/UserContext";
import { apiGet } from "../utils/api.utils";

const DsfrNavbar = () => {
  const location = useLocation();
  const [userContext] = useContext(UserContext);
  const [questionnaires] = useGet(`/api/questionnaires/`);
  const navigate = useNavigate();

  const validatedQuestionnaire =
    questionnaires.length && questionnaires?.filter((questionnaire) => questionnaire.isValidated);

  const handleLogout = async (e) => {
    e.preventDefault();
    const result = await apiGet(`/api/users/logout`, {
      headers: {
        Authorization: `Bearer ${userContext.token}`,
      },
    });
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
        to: `/questionnaires/${validatedQuestionnaire?.length && validatedQuestionnaire[0].id}/apercu`,
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
        {
          linkProps: {
            to: "/jobs/gestion",
          },
          text: "Gérer les jobs",
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
            to: "/suivi/campagnes",
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
    <>
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
      <Alert
        title={
          isLoggedIn ? "Sirius s’arrête le 31 mars – Pensez à téléchargez vos données" : "Sirius s’arrête le 31 mars"
        }
        severity="warning"
        description={
          isLoggedIn ? (
            <>
              <p>
                C’est avec beaucoup de regret que nous vous annonçons l’arrêt du service Sirius à compter du 31 mars.
                Cette décision résulte des fortes contraintes budgétaires actuelles qui ne permettent pas à la DGEFP de
                poursuivre le financement du produit.
              </p>
              <p>
                Nous savons que cette nouvelle sera décevante pour nombre d’entre vous et nous en sommes sincèrement
                désolés.
              </p>
              <p>
                <b>L’équipe Sirius</b>
              </p>
            </>
          ) : (
            <>
              <p>
                C’est avec beaucoup de regret que nous vous annonçons l’arrêt du service Sirius à compter du 31 mars.{" "}
              </p>
              <p>
                Cette décision résulte des fortes contraintes budgétaires actuelles qui ne permettent pas au ministère
                du travail de poursuivre le financement du produit.
              </p>
              <p>
                <b>L’équipe Sirius</b>
              </p>
            </>
          )
        }
      />
    </>
  );
};

export default DsfrNavbar;
