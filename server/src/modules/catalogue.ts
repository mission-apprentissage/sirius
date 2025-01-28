const ETABLISSEMENTS_CATALOGUE_API = "https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements";
const FORMATION_CATALOGUE_API = "https://catalogue-apprentissage.intercariforef.org/api/v1/entity/formation";

export const getEtablissement = async (siret: string) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${ETABLISSEMENTS_CATALOGUE_API}?query={ "siret": "${siret}"}&page=1&limit=1`, {
    method: "GET",
  });
  const data = (await response.json()) as { etablissements: any[] };

  return data.etablissements[0];
};

export const getFormation = async (catalogue_id: string, options = "") => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${FORMATION_CATALOGUE_API}/${catalogue_id}?${options}`, {
    method: "GET",
  });

  const data = (await response.json()) as any;
  return data;
};
