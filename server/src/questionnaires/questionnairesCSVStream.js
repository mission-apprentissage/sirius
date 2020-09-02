const { oleoduc } = require("oleoduc");
const moment = require("moment");
const { transformObjectIntoCSV } = require("../core/streamUtils");

let getReponse = (questionnaire, id, index) => {
  let reponse = questionnaire.reponses.find((r) => r.id === id);
  if (!reponse) {
    return null;
  }

  let { value, label } = reponse.data;
  if (index === undefined || !Array.isArray(value)) {
    return label;
  }

  let pos = value.findIndex((v) => v === index);
  return label.split(",")[pos];
};

module.exports = (db, extraColumns) => {
  let stream = db
    .collection("contrats")
    .aggregate([{ $unwind: "$questionnaires" }])
    .stream();

  return oleoduc(
    stream,
    transformObjectIntoCSV({
      id: (contrat) => contrat._id.toString(),
      cohorte: (contrat) => contrat.cohorte,
      type: ({ questionnaires }) => questionnaires.type,
      statut: ({ questionnaires }) => questionnaires.status,
      accord: ({ questionnaires }) => getReponse(questionnaires, "accord"),
      suivi: ({ questionnaires }) => getReponse(questionnaires, "suivi"),
      suiviPrecisions_1: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 1),
      suiviPrecisions_2: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 2),
      suiviPrecisions_3: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 3),
      suiviPrecisions_4: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 4),
      suiviPrecisions_5: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 5),
      suiviPrecisions_6: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 6),
      suiviPrecisions_7: ({ questionnaires }) => getReponse(questionnaires, "suiviPrecisions", 7),
      nouvelleEntreprise: ({ questionnaires }) => getReponse(questionnaires, "nouvelleEntreprise"),
      nouvelleEntrepriseAlerteCfa: ({ questionnaires }) => {
        return getReponse(questionnaires, "nouvelleEntrepriseAlerteCfa");
      },
      fierte_1: ({ questionnaires }) => getReponse(questionnaires, "fierte", 1),
      fierte_2: ({ questionnaires }) => getReponse(questionnaires, "fierte", 2),
      fierte_3: ({ questionnaires }) => getReponse(questionnaires, "fierte", 3),
      fierte_4: ({ questionnaires }) => getReponse(questionnaires, "fierte", 4),
      fierte_5: ({ questionnaires }) => getReponse(questionnaires, "fierte", 5),
      fierte_6: ({ questionnaires }) => getReponse(questionnaires, "fierte", 6),
      fierte_7: ({ questionnaires }) => getReponse(questionnaires, "fierte", 7),
      difficultes: ({ questionnaires }) => getReponse(questionnaires, "difficultes"),
      difficultesPasseesOrigines_1: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 1),
      difficultesPasseesOrigines_2: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 2),
      difficultesPasseesOrigines_3: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 3),
      difficultesPasseesOrigines_4: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 4),
      difficultesPasseesOrigines_5: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 5),
      difficultesPasseesOrigines_6: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 6),
      difficultesPasseesOrigines_7: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesOrigines", 7),
      difficultesPasseesSolutions_1: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 1);
      },
      difficultesPasseesSolutions_2: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 2);
      },
      difficultesPasseesSolutions_3: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 3);
      },
      difficultesPasseesSolutions_4: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 4);
      },
      difficultesPasseesSolutions_5: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 5);
      },
      difficultesPasseesSolutions_6: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 6);
      },
      difficultesPasseesSolutions_7: ({ questionnaires }) => {
        return getReponse(questionnaires, "difficultesPasseesSolutions", 7);
      },
      difficultesPasseesTexte: ({ questionnaires }) => getReponse(questionnaires, "difficultesPasseesTexte"),
      difficultesOrigines: ({ questionnaires }) => getReponse(questionnaires, "difficultesOrigines"),
      difficultesAlerteCfa_1: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 1),
      difficultesAlerteCfa_2: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 2),
      difficultesAlerteCfa_3: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 3),
      difficultesAlerteCfa_4: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 4),
      difficultesAlerteCfa_5: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 5),
      difficultesAlerteCfa_6: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 6),
      difficultesAlerteCfa_7: ({ questionnaires }) => getReponse(questionnaires, "difficultesAlerteCfa", 7),
      ambiance: ({ questionnaires }) => getReponse(questionnaires, "ambiance"),
      ateliers_1: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 1),
      ateliers_2: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 2),
      ateliers_3: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 3),
      ateliers_4: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 4),
      ateliers_5: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 5),
      ateliers_6: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 6),
      ateliers_7: ({ questionnaires }) => getReponse(questionnaires, "ateliers", 7),
      communauté: ({ questionnaires }) => getReponse(questionnaires, "communauté"),
      cfaNom: ({ cfa }) => cfa.nom,
      cfaSiret: ({ cfa }) => cfa.siret,
      cfaUaiResponsable: ({ cfa }) => cfa.uai_responsable,
      cfaUaiFormateur: ({ cfa }) => cfa.uai_formateur,
      formationCodeDiplome: ({ formation }) => formation.code_diplome,
      formationIntitule: ({ formation }) => formation.intitule,
      formationAnneePromotion: ({ formation }) => formation.annee_promotion,
      formationDebut: ({ formation }) => {
        return formation.periode ? moment(formation.periode.debut).format("YYYY-MM-DD") : null;
      },
      formationFin: ({ formation }) => (formation.periode ? moment(formation.periode.fin).format("YYYY-MM-DD") : null),
      ...extraColumns,
    })
  );
};
