const { VERBATIM_STATUS } = require("../constants");

const getChampsLibreField = (questionnaireUI, onlyOpenQuestions = false) => {
  const fieldsWithCustomMessageReceived = [];

  for (const category in questionnaireUI) {
    const categoryFields = questionnaireUI[category];

    for (const field in categoryFields) {
      const widget = categoryFields[field]["ui:widget"];
      if (onlyOpenQuestions) {
        if (widget === "customMessageReceived") {
          fieldsWithCustomMessageReceived.push(field);
        }
      } else {
        if (widget === "customMessageReceived" || widget === "textarea") {
          fieldsWithCustomMessageReceived.push(field);
        }
      }
    }
  }

  return fieldsWithCustomMessageReceived;
};

const getChampsLibreCount = (questionnaireUI, temoignages) => {
  const champsLibreField = getChampsLibreField(questionnaireUI, true);

  const champsLibresFieldsCountWithAnswer = temoignages.reduce((acc, cur) => {
    const answers = Object.keys(cur.reponses);
    const count = answers.filter((answer) => champsLibreField.includes(answer)).length;
    return acc + count;
  }, 0);

  return champsLibresFieldsCountWithAnswer || 0;
};

const findTitlesInJSON = (jsonData, keysToFind) => {
  const titles = {};

  const findTitles = (data, keys) => {
    if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (keys.includes(key) && data[key].title) {
          titles[key] = data[key].title;
        }
        findTitles(data[key], keys);
      }
    }
  };

  findTitles(jsonData, keysToFind);

  return titles;
};

const filterChampsLibresAndFlatten = (temoignages, fieldsWithChampsLibre) => {
  return temoignages.map((verbatim) => {
    const champsLibre = {};

    for (const field of fieldsWithChampsLibre) {
      if (verbatim.reponses && field in verbatim.reponses) {
        if (typeof verbatim.reponses[field] === "string") {
          champsLibre[field] = {
            status: VERBATIM_STATUS.PENDING,
            content: verbatim.reponses[field],
          };
        } else {
          champsLibre[field] = verbatim.reponses[field];
        }
      }
    }

    return Object.keys(champsLibre).length
      ? {
          temoignageId: verbatim._id,
          verbatims: champsLibre,
          createdAt: verbatim.createdAt,
          campagneId: verbatim.campagneId,
          formation: verbatim.formation ? verbatim.formation.data.intitule_long : "",
          formationId: verbatim.formation ? verbatim.formation._id : "",
          etablissement: verbatim.etablissement
            ? verbatim.etablissement.data.onisep_nom ||
              verbatim.etablissement.data.enseigne ||
              verbatim.etablissement.data.entreprise_raison_sociale
            : "",
          etablissementSiret: verbatim.etablissement ? verbatim.etablissement.data.siret : "",
        }
      : null;
  });
};

const appendVerbatimsWithCampagneNameAndRestructure = (
  verbatimsWithChampsLibre,
  campagnesByQuestionnaireId,
  champsLibreFieldsTitle
) => {
  const flattenVerbatims = [];

  verbatimsWithChampsLibre.filter(Boolean).forEach((item) => {
    const { temoignageId, createdAt, campagneId, formation, formationId, etablissement, etablissementSiret } = item;
    const campagne = campagnesByQuestionnaireId.find((campagne) => campagne._id.toString() === campagneId);
    for (const key in item.verbatims) {
      const newObject = {
        temoignageId,
        createdAt,
        key,
        value: item.verbatims[key],
        title: champsLibreFieldsTitle[key],
        formation,
        formationId,
        etablissement,
        etablissementSiret,
        campagneName: campagne && campagne.nomCampagne ? campagne.nomCampagne : "",
      };

      flattenVerbatims.push(newObject);
    }
  });
  return flattenVerbatims;
};

const appendFormationAndEtablissementToVerbatims = (temoignages, campagnesByQuestionnaireId) => {
  const result = temoignages.map((temoignage) => {
    const campagne = campagnesByQuestionnaireId.find((campagne) => campagne._id.toString() === temoignage.campagneId);
    return {
      ...temoignage,
      etablissement: campagne && campagne.etablissement ? campagne.etablissement : null,
      formation: campagne && campagne.formation ? campagne.formation : null,
      etablissementSiret: campagne && campagne.etablissementSiret ? campagne.etablissementSiret : null,
      formationId: campagne && campagne.formationId ? campagne.formationId : null,
    };
  });
  return result;
};

module.exports = {
  getChampsLibreField,
  getChampsLibreCount,
  findTitlesInJSON,
  filterChampsLibresAndFlatten,
  appendVerbatimsWithCampagneNameAndRestructure,
  appendFormationAndEtablissementToVerbatims,
};
