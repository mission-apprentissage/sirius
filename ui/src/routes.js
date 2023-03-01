import ViewCampagnes from "./campagnes/ViewCampagnes";
import CampagneForm from "./campagnes/CampagneForm";
import AnswerCampagne from "./campagnes/AnswerCampagne";
import EditCampagne from "./campagnes/EditCampagne";
import Login from "./users/Login";

const routes = [
  { path: "/campagnes", name: "Campagnes", isProtected: true, Component: ViewCampagnes },
  { path: "/campagnes/ajout", name: "Ajouter une campagne", isProtected: true, Component: CampagneForm },
  { path: "/campagnes/:id", name: "Questionnaire", isProtected: false, Component: AnswerCampagne },
  { path: "/campagnes/:id/edition", name: "Modifier la campagne", isProtected: true, Component: EditCampagne },
  { path: "/connexion/", name: "Connexion", isProtected: false, Component: Login },
];

export default routes;
