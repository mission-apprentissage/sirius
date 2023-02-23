import ViewCampagnes from "./campagnes/ViewCampagnes";
import AddCampagne from "./campagnes/AddCampagne";
import AnswerCampagne from "./campagnes/AnswerCampagne";
import Login from "./users/Login";

const routes = [
  { path: "/campagnes", name: "Campagnes", Component: ViewCampagnes },
  { path: "/campagnes/ajout", name: "Ajouter une campagne", Component: AddCampagne },
  { path: "/campagnes/:id", name: "Questionnaire", Component: AnswerCampagne },
  { path: "/connexion/", name: "Connexion", Component: Login },
];

export default routes;
