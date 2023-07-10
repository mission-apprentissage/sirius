import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import ViewCampagnes from "./campagnes/ViewCampagnes";
import TemoignagesDashboard from "./temoignages/Dashboard";
import TemoignagesManaging from "./temoignages/Managing";
import CampagneForm from "./campagnes/CampagneForm";
import AnswerCampagne from "./campagnes/AnswerCampagne";
import EditCampagne from "./campagnes/EditCampagne";
import Login from "./users/Login";
import MentionsInformation from "./legal/MentionsInformation";
import CGU from "./legal/CGU";
import PolitiqueConfidentialite from "./legal/PolitiqueConfidentialite";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route exact path="/" element={<ViewCampagnes />} />
          <Route exact path="/campagnes/ajout" element={<CampagneForm />} />
          <Route exact path="/campagnes/:id/edition" element={<EditCampagne />} />
          <Route exact path="/campagnes" element={<ViewCampagnes />} />
          <Route exact path="/temoignages/dashboard" element={<TemoignagesDashboard />} />
          <Route exact path="/temoignages/gestion" element={<TemoignagesManaging />} />
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
