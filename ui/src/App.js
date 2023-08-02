import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
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
import MentionsInformation from "./legal/MentionsInformation";
import CGU from "./legal/CGU";
import PolitiqueConfidentialite from "./legal/PolitiqueConfidentialite";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/" element={<Navigate to="/campagnes/gestion" />} />
          <Route exact path="/campagnes/ajout" element={<CreateCampagne />} />
          <Route exact path="/campagnes/:id/edition" element={<EditCampagne />} />
          <Route exact path="/campagnes/:id/duplication" element={<DuplicateCampagne />} />
          <Route exact path="/campagnes/gestion" element={<ViewCampagnes />} />
          <Route exact path="/temoignages/dashboard" element={<TemoignagesDashboard />} />
          <Route exact path="/temoignages/gestion" element={<TemoignagesManaging />} />
          <Route exact path="/questionnaires/gestion" element={<QuestionnairesManaging />} />
          <Route exact path="/questionnaires/ajout" element={<QuestionnaireForm />} />
          <Route exact path="/questionnaires/:id/edition" element={<EditQuestionnaire />} />
          <Route exact path="/questionnaires/:id/apercu" element={<PreviewQuestionnaire />} />
        </Route>
        <Route exact path="/connexion" element={<Login />} />
        <Route exact path="/campagnes/:id" element={<AnswerCampagne />} />
        <Route exact path="/mentions-information" element={<MentionsInformation />} />
        <Route exact path="/cgu" element={<CGU />} />
        <Route exact path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
      </Routes>
    </Router>
  );
}

export default App;
