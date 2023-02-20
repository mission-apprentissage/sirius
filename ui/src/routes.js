import ViewCampagnes from "./campagnes/ViewCampagnes";
import AddCampagne from "./campagnes/AddCampagne";
import AnswerCampagne from "./campagnes/AnswerCampagne";

const routes = [
  { path: "/campagnes", name: "Campagnes", Component: ViewCampagnes },
  { path: "/campagnes/ajout", name: "Ajouter une campagne", Component: AddCampagne },
  { path: "/campagnes/:id", name: "Questionnaire", Component: AnswerCampagne },
];

export default routes;
