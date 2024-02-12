import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ManageCampagnesPage from "./campagnes/ManageCampagnesPage";
import TemoignagesManaging from "./temoignages/Managing";
import QuestionnairesManaging from "./questionnaires/Managing";
import QuestionnaireForm from "./questionnaires/QuestionnaireForm";
import EditQuestionnaire from "./questionnaires/EditQuestionnaire";
import PreviewCampagnePage from "./campagnes/PreviewCampagnePage";
import CreateCampagnesPage from "./campagnes/CreateCampagnesPage";
import AnswerCampagnePage from "./campagnes/AnswerCampagnePage";
import Login from "./users/Login";
import Signup from "./users/Signup";
import PendingAccount from "./users/PendingAccount";
import Confirmation from "./users/Confirmation";
import MentionsInformationBackOffice from "./legal/MentionsInformationBackOffice";
import MentionsInformationQuestionnaire from "./legal/MentionsInformationQuestionnaire";
import CGU from "./legal/CGU";
import UsersManaging from "./users/Managing";
import ModerationPage from "./verbatims/ModerationPage";
import Layout from "./Components/Layout";
import AnonymousLayout from "./Components/AnonymousLayout";
import QuestionnaireLayout from "./Components/QuestionnaireLayout";
import ResultsCampagnesPage from "./campagnes/ResultsCampagnesPage";
import SuiviEtablissementsPage from "./suivi/SuiviEtablissementsPage";
import SuiviCampagnesPage from "./suivi/SuiviCampagnesPage";
import HomePage from "./HomePage";

function App() {
  const { setIsDark } = useIsDark();
  setIsDark(false);

  return (
    <Routes>
      <Route
        element={
          <Layout>
            <ProtectedRoute />
          </Layout>
        }
      >
        <Route exact path="/campagnes/ajout" element={<CreateCampagnesPage />} />
        <Route exact path="/campagnes/gestion" element={<ManageCampagnesPage />} />
        <Route exact path="/campagnes/resultats" element={<ResultsCampagnesPage />} />
      </Route>
      <Route
        element={
          <Layout>
            <AdminProtectedRoute />
          </Layout>
        }
      >
        <Route exact path="/temoignages/gestion" element={<TemoignagesManaging />} />
        <Route exact path="/questionnaires/gestion" element={<QuestionnairesManaging />} />
        <Route exact path="/questionnaires/ajout" element={<QuestionnaireForm />} />
        <Route exact path="/questionnaires/:id/edition" element={<EditQuestionnaire />} />
        <Route exact path="/utilisateurs/gestion" element={<UsersManaging />} />
        <Route exact path="/verbatims/moderation" element={<ModerationPage />} />
        <Route exact path="/suivi/etablissements" element={<SuiviEtablissementsPage />} />
        <Route exact path="/suivi/campagnes" element={<SuiviCampagnesPage />} />
      </Route>
      <Route
        element={
          <AnonymousLayout>
            <Outlet />
          </AnonymousLayout>
        }
      >
        <Route exact path="/" element={<HomePage />} />
        <Route exact path="/connexion" element={<Login />} />
        <Route exact path="/modification-mot-de-passe" element={<Login />} />
        <Route exact path="/inscription" element={<Signup />} />
        <Route exact path="/confirmer-utilisateur" element={<Confirmation />} />
      </Route>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route
          exact
          path="/mentions-information-questionnaire"
          element={<MentionsInformationQuestionnaire />}
        />
        <Route
          exact
          path="/mentions-information-backoffice"
          element={<MentionsInformationBackOffice />}
        />
        <Route exact path="/cgu" element={<CGU />} />
        <Route exact path="/compte-desactive" element={<PendingAccount />} />
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
    </Routes>
  );
}

export default App;
