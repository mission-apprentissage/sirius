export const etablissementLabelGetter = (data) => {
  if (!data && !Object.keys(data).length) return "";
  return data?.onisep_nom || data?.enseigne || data?.entreprise_raison_sociale || "";
};
