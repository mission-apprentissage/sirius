import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import ManageCampagnes from "./campagnes/ManageCampagnes";
import TemoignagesManaging from "./temoignages/Managing";
import QuestionnairesManaging from "./questionnaires/Managing";
import QuestionnaireForm from "./questionnaires/QuestionnaireForm";
import EditQuestionnaire from "./questionnaires/EditQuestionnaire";
import PreviewQuestionnaire from "./questionnaires/PreviewQuestionnaire";
import CreateCampagne from "./campagnes/CreateCampagne";
import AnswerCampagne from "./campagnes/AnswerCampagne";
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
import ResultatsPage from "./campagnes/ResultatsPage";

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
        <Route exact path="/campagnes/gestion" element={<ManageCampagnes />} />
        <Route exact path="/campagnes/resultats" element={<ResultatsPage />} />
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
      </Route>
      <Route
        element={
          <Layout>
            <Outlet />
          </Layout>
        }
      >
        <Route exact path="/mentions-information" element={<MentionsInformation />} />
        <Route exact path="/cgu" element={<CGU />} />
        <Route exact path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
        <Route exact path="/compte-desactive" element={<PendingAccount />} />
      </Route>
      <Route
        element={
          <QuestionnaireLayout>
            <Outlet />
          </QuestionnaireLayout>
        }
      >
        <Route exact path="/campagnes/:id" element={<AnswerCampagne />} />
        <Route exact path="/questionnaires/:id/apercu" element={<PreviewQuestionnaire />} />
      </Route>
    </Routes>
  );
}

export default App;
