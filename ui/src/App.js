import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ViewCampagnes from "./campagnes/ViewCampagnes";
import TemoignagesDashboard from "./temoignages/Dashboard";
import TemoignagesManaging from "./temoignages/Managing";
import QuestionnairesManaging from "./questionnaires/Managing";
import QuestionnaireForm from "./questionnaires/QuestionnaireForm";
import EditQuestionnaire from "./questionnaires/EditQuestionnaire";
import PreviewQuestionnaire from "./questionnaires/PreviewQuestionnaire";
import CreateCampagne from "./campagnes/CreateCampagne";
import AnswerCampagne from "./campagnes/AnswerCampagne";
import EditCampagne from "./campagnes/EditCampagne";
import DuplicateCampagne from "./campagnes/DuplicateCampagne";
import Login from "./users/Login";
import Signup from "./users/Signup";
import PendingAccount from "./users/PendingAccount";
import Confirmation from "./users/Confirmation";
import MentionsInformation from "./legal/MentionsInformation";
import CGU from "./legal/CGU";
import PolitiqueConfidentialite from "./legal/PolitiqueConfidentialite";
import UsersManaging from "./users/Managing";
import VerbatimsModeration from "./verbatims/Moderation";
import Layout from "./Components/Layout";
import AnonymousLayout from "./Components/AnonymousLayout";
import QuestionnaireLayout from "./Components/QuestionnaireLayout";

function App() {
  return (
    <Routes>
      <Route
        element={
          <Layout>
            <ProtectedRoute />
          </Layout>
        }
      >
        <Route exact path="/" element={<Navigate to="/campagnes/gestion" />} />
        <Route exact path="/campagnes/ajout" element={<CreateCampagne />} />
        <Route exact path="/campagnes/:id/edition" element={<EditCampagne />} />
        <Route exact path="/campagnes/:id/duplication" element={<DuplicateCampagne />} />
        <Route exact path="/campagnes/gestion" element={<ViewCampagnes />} />
        <Route exact path="/temoignages/dashboard" element={<TemoignagesDashboard />} />
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
        <Route exact path="/questionnaires/:id/apercu" element={<PreviewQuestionnaire />} />
        <Route exact path="/utilisateurs/gestion" element={<UsersManaging />} />
        <Route exact path="/verbatims/moderation" element={<VerbatimsModeration />} />
      </Route>
      <Route
        element={
          <AnonymousLayout>
            <Outlet />
          </AnonymousLayout>
        }
      >
        <Route exact path="/connexion" element={<Login />} />
        <Route exact path="/modification-mot-de-passe" element={<Login />} />
        <Route exact path="/inscription" element={<Signup />} />
        <Route exact path="/confirmer-utilisateur" element={<Confirmation />} />
        <Route exact path="/compte-desactive" element={<PendingAccount />} />
        <Route exact path="/mentions-information" element={<MentionsInformation />} />
        <Route exact path="/cgu" element={<CGU />} />
        <Route exact path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
      </Route>
      <Route
        element={
          <QuestionnaireLayout>
            <Outlet />
          </QuestionnaireLayout>
        }
      >
        <Route exact path="/campagnes/:id" element={<AnswerCampagne />} />
      </Route>
    </Routes>
  );
}

export default App;
