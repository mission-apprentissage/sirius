const { oleoduc } = require("oleoduc");
const { transformObjectIntoCSV } = require("../core/streamUtils");

let getReponse = (questionnaire, id) => {
  let reponse = questionnaire.reponses.find((r) => r.id === id);
  return reponse ? reponse.data.label : null;
};

module.exports = (db, extraColumns) => {
  let stream = db
    .collection("contrats")
    .aggregate([{ $match: { "questionnaires.0.reponses.0": { $exists: true } } }, { $unwind: "$questionnaires" }])
    .stream();

  return oleoduc(
    stream,
    transformObjectIntoCSV({
      type: ({ questionnaires }) => questionnaires.type,
      statut: ({ questionnaires }) => questionnaires.status,
      accord: ({ questionnaires }) => getReponse(questionnaires, "accord"),
      suivi: ({ questionnaires }) => getReponse(questionnaires, "suivi"),
      suiviPrecisions: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions"),
      nouvelleEntreprise: ({ questionnaires }) => getReponse(questionnaires, "nouvelleEntreprise"),
      nouvelleEntrepriseAlerteCfa: ({ questionnaires }) => {
        return getReponse(questionnaires, "nouvelleEntrepriseAlerteCfa");
      },
      fierte: ({ questionnaires }) => getReponse(questionnaires, "fierte"),
      difficultes: ({ questionnaires }) => getReponse(questionnaires, "difficultes"),
      difficultesPasseesOrigines: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines"),
      difficultesPasseesSolutions: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions");
      },
      difficultesPasseesTexte: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesTexte"),
      difficultesOrigines: ({ questionnaires }) => getReponse(questionnaires, "difficultesOrigines"),
      difficultesAlerteCfa: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa"),
      ambiance: ({ questionnaires }) => getReponse(questionnaires, "ambiance"),
      ateliers: ({ questionnaires }) => getReponse(questionnaires, "ateliers"),
      communauté: ({ questionnaires }) => getReponse(questionnaires, "communauté"),
      ...extraColumns,
    })
  );
};
