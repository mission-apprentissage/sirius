import ViewCampagnes from "./campagnes/ViewCampagnes";
import AddCampagne from "./campagnes/AddCampagne";
import AnswerCampagne from "./campagnes/AnswerCampagne";
import Login from "./users/Login";

const routes = [
  { path: "/campagnes", name: "Campagnes", isProtected: true, Component: ViewCampagnes },
  { path: "/campagnes/ajout", name: "Ajouter une campagne", isProtected: true, Component: AddCampagne },
  { path: "/campagnes/:id", name: "Questionnaire", isProtected: false, Component: AnswerCampagne },
  { path: "/connexion/", name: "Connexion", isProtected: false, Component: Login },
];

export default routes;
