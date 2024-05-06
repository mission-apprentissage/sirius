const REFERENTIEL_API = "https://referentiel.apprentissage.onisep.fr/api/v1/organismes";

const getEtablissements = async (siretArray) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;

  try {
    const response = await fetch(`${REFERENTIEL_API}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sirets: siretArray.join(","),
        items_par_page: 1000,
      }),
    });
    const data = await response.json();
    return data.organismes;
  } catch (e) {
    console.error(e);
    return [];
  }
};
const getEtablissementNature = async (siret) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${REFERENTIEL_API}/${siret}`, {
    method: "GET",
  });
  const data = await response.json();

  return data.nature;
};

const getEtablissementSIRETFromRelationType = async (siret, wantedRelation) => {
  try {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const fetch = (await import("node-fetch")).default;
    const response = await fetch(`${REFERENTIEL_API}/${siret}`, {
      method: "GET",
    });
    const data = await response.json();

    const filteredRelationsSiret = data.relations
      .filter((relation) => relation.type === wantedRelation)
      .map((etablissementFormateur) => etablissementFormateur.siret);

    return filteredRelationsSiret;
  } catch (e) {
    console.error(e);
    return [];
  }
};

module.exports = {
  getEtablissements,
  getEtablissementNature,
  getEtablissementSIRETFromRelationType,
};
