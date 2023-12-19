const REFERENTIEL_API = "https://referentiel.apprentissage.onisep.fr/api/v1/organismes";

const getEtablissementNature = async (siret) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${REFERENTIEL_API}/${siret}`, {
    method: "GET",
  });
  const data = await response.json();

  return data.nature;
};

const getEtablissementFormateurSIRETFromGestionnaires = async (siret) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${REFERENTIEL_API}/${siret}`, {
    method: "GET",
  });
  const data = await response.json();

  const filteredRelationsSiret = data.relations
    .filter((relation) => relation.type === "responsable->formateur")
    .map((etablissementFormateur) => etablissementFormateur.siret);

  return filteredRelationsSiret;
};

module.exports = {
  getEtablissementNature,
  getEtablissementFormateurSIRETFromGestionnaires,
};
