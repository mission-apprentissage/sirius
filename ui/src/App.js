/* eslint-disable no-undef */
import "./assets/fonts/fonts.css";

import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import { useContext, useEffect } from "react";
import { Outlet, Route, Routes, useLocation } from "react-router-dom";

import AdminProtectedRoute from "./AdminProtectedRoute";
import AnswerCampagnePage from "./campagnes/AnswerCampagnePage";
import CreateCampagnesPage from "./campagnes/CreateCampagnesPage";
import ManageCampagnesPage from "./campagnes/ManageCampagnesPage";
import PreviewCampagnePage from "./campagnes/PreviewCampagnePage";
import ResultsCampagnesPage from "./campagnes/ResultsCampagnesPage";
import DsfrIframeLayout from "./Components/DsfrIframeLayout";
import DsfrLayout from "./Components/DsfrLayout";
import Layout from "./Components/Layout";
import QuestionnaireLayout from "./Components/QuestionnaireLayout";
import { USER_ROLES } from "./constants";
import { UserContext } from "./context/UserContext";
import EtablissementOrAdminProtectedRoute from "./EtablissementOrAdminProtectedRoute";
import DiffusionGuidePage from "./guide/DiffusionGuidePage";
import HomePage from "./home/HomePage";
import useMatomo from "./hooks/useMatomo";
import IframeEtablissementPage from "./iframes/IframeEtablissementPage";
import IframeFormationPage from "./iframes/IframeFormationPage";
import ManageJobsPage from "./jobs/ManageJobsPage";
import CguPage from "./legal/CguPage";
import DeclarationAccessibilitePage from "./legal/DeclarationAccessibilitePage";
import MentionsInformationBackOfficePage from "./legal/MentionsInformationBackOfficePage";
import MentionsInformationQuestionnairePage from "./legal/MentionsInformationQuestionnairePage";
import ProtectedRoute from "./ProtectedRoute";
import EditQuestionnaire from "./questionnaires/EditQuestionnaire";
import QuestionnairesManaging from "./questionnaires/Managing";
import QuestionnaireForm from "./questionnaires/QuestionnaireForm";
import StatisticsPage from "./statistics/StatisticsPage";
import SuiviCampagnesPage from "./suivi/SuiviCampagnesPage";
import SuiviEtablissementsPage from "./suivi/SuiviEtablissementsPage";
import ManageTemoignagesPage from "./temoignages/ManageTemoignagesPage";
import EmailConfirmationPage from "./users/EmailConfirmationPage";
import LoginPage from "./users/LoginPage";
import UsersManaging from "./users/Managing";
import PendingAccountPage from "./users/PendingAccountPage";
import SignupPage from "./users/SignupPage";
import ModerationPage from "./verbatims/ModerationPage";

function App() {
  const { setIsDark } = useIsDark();
  const [userContext] = useContext(UserContext);
  const location = useLocation();
  setIsDark(false);

  const isProd = process.env.REACT_APP_ENV === "production";
  const isAdmin = userContext?.user?.role === USER_ROLES.ADMIN;
  const isSudo = userContext?.user?.isSudo;
  const isLoading = userContext?.loading;

  const disableTracking = localStorage.getItem("disableTracking") === "true";
  const enableMatomo = !isLoading && !isAdmin && !disableTracking && !isProd && !isSudo;

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const noTrackingParam = urlParams.get("notracking");

    if (noTrackingParam === "true") {
      localStorage.setItem("disableTracking", "true");
      console.info("Tracking disabled");
    } else if (noTrackingParam === "reset") {
      localStorage.removeItem("disableTracking");
    }
  }, [location.search]);

  useMatomo(enableMatomo);

  useEffect(() => {
    const pushPageView = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      window._paq.push(["setDocumentTitle", document.title || location.pathname]);
      window._paq.push(["setCustomUrl", window.location.href]);
      window._paq.push(["trackPageView"]);
    };
    if (enableMatomo && window._paq) {
      pushPageView();
    }
  }, [location, enableMatomo]);

  return (
    <Routes>
      <Route
        element={
          <DsfrLayout>
            <EtablissementOrAdminProtectedRoute />
          </DsfrLayout>
        }
      >
        <Route exact path="/campagnes/ajout" element={<CreateCampagnesPage />} />
        <Route exact path="/campagnes/gestion" element={<ManageCampagnesPage />} />
      </Route>
      <Route
        element={
          <DsfrLayout>
            <ProtectedRoute />
          </DsfrLayout>
        }
      >
        <Route exact path="/campagnes/resultats" element={<ResultsCampagnesPage />} />
      </Route>
      <Route
        element={
          <DsfrLayout>
            <AdminProtectedRoute />
          </DsfrLayout>
        }
      >
        <Route exact path="/temoignages/gestion" element={<ManageTemoignagesPage />} />
        <Route exact path="/verbatims/moderation" element={<ModerationPage />} />
        <Route exact path="/jobs/gestion" element={<ManageJobsPage />} />
      </Route>
      <Route
        element={
          <Layout>
            <AdminProtectedRoute />
          </Layout>
        }
      >
        <Route exact path="/questionnaires/gestion" element={<QuestionnairesManaging />} />
        <Route exact path="/questionnaires/ajout" element={<QuestionnaireForm />} />
        <Route exact path="/questionnaires/:id/edition" element={<EditQuestionnaire />} />
        <Route exact path="/utilisateurs/gestion" element={<UsersManaging />} />
        <Route exact path="/suivi/etablissements" element={<SuiviEtablissementsPage />} />
        <Route exact path="/suivi/campagnes" element={<SuiviCampagnesPage />} />
      </Route>
      <Route
        element={
          <DsfrLayout>
            <Outlet />
          </DsfrLayout>
        }
      >
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/statistiques" element={<StatisticsPage />} />
        <Route exact path="/connexion" element={<LoginPage />} />
        <Route exact path="/inscription" element={<SignupPage />} />
        <Route exact path="/modification-mot-de-passe" element={<LoginPage />} />
        <Route exact path="/compte-desactive" element={<PendingAccountPage />} />
        <Route exact path="/cgu" element={<CguPage />} />
        <Route exact path="/guide-diffusion" element={<DiffusionGuidePage />} />
        <Route exact path="/mentions-information-questionnaire" element={<MentionsInformationQuestionnairePage />} />
        <Route exact path="/mentions-information-backoffice" element={<MentionsInformationBackOfficePage />} />
        <Route exact path="/confirmer-utilisateur" element={<EmailConfirmationPage />} />
        <Route exact path="/declaration-accessibilite" element={<DeclarationAccessibilitePage />} />
      </Route>
      <Route
        element={
          <QuestionnaireLayout>
            <Outlet />
          </QuestionnaireLayout>
        }
      >
        <Route exact path="/campagnes/:id" element={<AnswerCampagnePage />} />
        <Route exact path="/questionnaires/:id/apercu" element={<PreviewCampagnePage />} />
      </Route>
      <Route
        element={
          <DsfrIframeLayout>
            <Outlet />
          </DsfrIframeLayout>
        }
      >
        <Route exact path="/iframes/formation" element={<IframeFormationPage />} />
        <Route exact path="/iframes/etablissement" element={<IframeEtablissementPage />} />
      </Route>
    </Routes>
  );
}

export default App;
