const { oleoduc, transformObject } = require("oleoduc");
const moment = require("moment");

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

module.exports = (db, extraColumnsCallback = () => ({})) => {
  let stream = db
    .collection("contrats")
    .aggregate([{ $unwind: "$questionnaires" }])
    .stream();

  return oleoduc(
    stream,
    transformObject((contrat) => {
      let { questionnaires, formation, cfa } = contrat;

      return {
        id: contrat._id.toString(),
        cohorte: contrat.cohorte,
        type: questionnaires.type,
        statut: questionnaires.status,
        accord: getReponse(questionnaires, "accord"),
        suivi: getReponse(questionnaires, "suivi"),
        suiviPrecisions_1: getReponse(questionnaires, "suiviPrecisions", 1),
        suiviPrecisions_2: getReponse(questionnaires, "suiviPrecisions", 2),
        suiviPrecisions_3: getReponse(questionnaires, "suiviPrecisions", 3),
        suiviPrecisions_4: getReponse(questionnaires, "suiviPrecisions", 4),
        suiviPrecisions_5: getReponse(questionnaires, "suiviPrecisions", 5),
        suiviPrecisions_6: getReponse(questionnaires, "suiviPrecisions", 6),
        suiviPrecisions_7: getReponse(questionnaires, "suiviPrecisions", 7),
        nouvelleEntreprise: getReponse(questionnaires, "nouvelleEntreprise"),
        nouvelleEntrepriseAlerteCfa: getReponse(questionnaires, "nouvelleEntrepriseAlerteCfa"),
        fierte_1: getReponse(questionnaires, "fierte", 1),
        fierte_2: getReponse(questionnaires, "fierte", 2),
        fierte_3: getReponse(questionnaires, "fierte", 3),
        fierte_4: getReponse(questionnaires, "fierte", 4),
        fierte_5: getReponse(questionnaires, "fierte", 5),
        fierte_6: getReponse(questionnaires, "fierte", 6),
        fierte_7: getReponse(questionnaires, "fierte", 7),
        difficultes: getReponse(questionnaires, "difficultes"),
        difficultesPasseesOrigines_1: getReponse(questionnaires, "difficultesPasseesOrigines", 1),
        difficultesPasseesOrigines_2: getReponse(questionnaires, "difficultesPasseesOrigines", 2),
        difficultesPasseesOrigines_3: getReponse(questionnaires, "difficultesPasseesOrigines", 3),
        difficultesPasseesOrigines_4: getReponse(questionnaires, "difficultesPasseesOrigines", 4),
        difficultesPasseesOrigines_5: getReponse(questionnaires, "difficultesPasseesOrigines", 5),
        difficultesPasseesOrigines_6: getReponse(questionnaires, "difficultesPasseesOrigines", 6),
        difficultesPasseesOrigines_7: getReponse(questionnaires, "difficultesPasseesOrigines", 7),
        difficultesPasseesSolutions_1: getReponse(questionnaires, "difficultesPasseesSolutions", 1),
        difficultesPasseesSolutions_2: getReponse(questionnaires, "difficultesPasseesSolutions", 2),
        difficultesPasseesSolutions_3: getReponse(questionnaires, "difficultesPasseesSolutions", 3),
        difficultesPasseesSolutions_4: getReponse(questionnaires, "difficultesPasseesSolutions", 4),
        difficultesPasseesSolutions_5: getReponse(questionnaires, "difficultesPasseesSolutions", 5),
        difficultesPasseesSolutions_6: getReponse(questionnaires, "difficultesPasseesSolutions", 6),
        difficultesPasseesSolutions_7: getReponse(questionnaires, "difficultesPasseesSolutions", 7),
        difficultesPasseesTexte: getReponse(questionnaires, "difficultesPasseesTexte"),
        difficultesOrigines: getReponse(questionnaires, "difficultesOrigines"),
        difficultesAlerteCfa_1: getReponse(questionnaires, "difficultesAlerteCfa", 1),
        difficultesAlerteCfa_2: getReponse(questionnaires, "difficultesAlerteCfa", 2),
        difficultesAlerteCfa_3: getReponse(questionnaires, "difficultesAlerteCfa", 3),
        difficultesAlerteCfa_4: getReponse(questionnaires, "difficultesAlerteCfa", 4),
        difficultesAlerteCfa_5: getReponse(questionnaires, "difficultesAlerteCfa", 5),
        difficultesAlerteCfa_6: getReponse(questionnaires, "difficultesAlerteCfa", 6),
        difficultesAlerteCfa_7: getReponse(questionnaires, "difficultesAlerteCfa", 7),
        ambiance: getReponse(questionnaires, "ambiance"),
        ateliers_1: getReponse(questionnaires, "ateliers", 1),
        ateliers_2: getReponse(questionnaires, "ateliers", 2),
        ateliers_3: getReponse(questionnaires, "ateliers", 3),
        ateliers_4: getReponse(questionnaires, "ateliers", 4),
        ateliers_5: getReponse(questionnaires, "ateliers", 5),
        ateliers_6: getReponse(questionnaires, "ateliers", 6),
        ateliers_7: getReponse(questionnaires, "ateliers", 7),
        communauté: getReponse(questionnaires, "communauté"),
        cfaNom: cfa.nom,
        cfaSiret: cfa.siret,
        cfaUaiResponsable: cfa.uaiResponsable,
        cfaUaiFormateur: cfa.uaiFormateur,
        formationCodeDiplome: formation.codeDiplome,
        formationIntitule: formation.intitule,
        formationAnneePromotion: formation.anneePromotion,
        formationDebut: formation.periode ? moment(formation.periode.debut).format("YYYY-MM-DD") : null,
        formationFin: formation.periode ? moment(formation.periode.fin).format("YYYY-MM-DD") : null,
        ...extraColumnsCallback(contrat),
      };
    })
  );
};
