// @ts-nocheck -- TODO

const CATALOGUE_API = "https://catalogue-apprentissage.intercariforef.org/api/v1/entity/etablissements";

export const getEtablissement = async (siret: string) => {
  // eslint-disable-next-line node/no-unsupported-features/es-syntax
  const fetch = (await import("node-fetch")).default;
  const response = await fetch(`${CATALOGUE_API}?query={ "siret": "${siret}"}&page=1&limit=1`, {
    method: "GET",
  });
  const data = await response.json();

  return data.etablissements[0];
};
