import ViewCampagnes from "./campagnes/ViewCampagnes";
import AddCampagne from "./campagnes/AddCampagne";

const routes = [
  { path: "/campagnes", name: "Campagnes", Component: ViewCampagnes },
  { path: "/campagnes/ajout", name: "Ajouter une campagne", Component: AddCampagne },
];

export default routes;
