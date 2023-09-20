const getChampsLibreField = (questionnaireUI) => {
  const fieldsWithCustomMessageReceived = [];

  for (const category in questionnaireUI) {
    const categoryFields = questionnaireUI[category];

    for (const field in categoryFields) {
      const widget = categoryFields[field]["ui:widget"];
      if (widget === "customMessageReceived" || widget === "textarea") {
        fieldsWithCustomMessageReceived.push(field);
      }
    }
  }

  return fieldsWithCustomMessageReceived;
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
      if (field in verbatim.reponses) {
        champsLibre[field] = verbatim.reponses[field];
      }
    }

    return Object.keys(champsLibre).length
      ? {
          temoignageId: verbatim._id,
          verbatims: champsLibre,
          createdAt: verbatim.createdAt,
          campagneId: verbatim.campagneId,
          formation: verbatim.formation ? verbatim.formation.data.intitule_long : "",
          etablissement: verbatim.etablissement ? verbatim.etablissement.data.onisep_nom : "",
        }
      : null;
  });
};

const appendVerbatimsWithCampagneNameAndRestructure = (
  verbatimsWithChampsLibre,
  campagnesByQuestionnaireId,
  titles
) => {
  const flattenVerbatims = [];

  verbatimsWithChampsLibre.filter(Boolean).forEach((item) => {
    const { temoignageId, createdAt, campagneId, formation, etablissement } = item;
    const campagne = campagnesByQuestionnaireId.find((campagne) => campagne._id.toString() === campagneId);
    for (const key in item.verbatims) {
      const newObject = {
        temoignageId,
        createdAt,
        key,
        value: item.verbatims[key],
        title: titles[key],
        formation,
        etablissement,
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
    };
  });
  return result;
};

module.exports = {
  getChampsLibreField,
  findTitlesInJSON,
  filterChampsLibresAndFlatten,
  appendVerbatimsWithCampagneNameAndRestructure,
  appendFormationAndEtablissementToVerbatims,
};
