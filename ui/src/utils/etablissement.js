export const etablissementLabelGetter = (data) => {
  if (!data || !Object.keys(data)?.length) return "";
  return data?.entrepriseRaisonSociale || data?.onisepNom || data?.enseigne || "";
};

export const etablissementLabelGetterFromFormation = (data) => {
  if (!data || !Object.keys(data)?.length) return "";
  return (
    data?.etablissementFormateurEntrepriseRaisonSociale ||
    data?.etablissementFormateurEnseigne ||
    data?.etablissementGestionnaireEnseigne ||
    data?.etablissementGestionnaireEntrepriseRaisonSociale ||
    ""
  );
};

export const remoteEtablissementLabelGetter = (data) => {
  if (!data || !Object.keys(data)?.length) return "";
  return data?.onisep_nom || data?.enseigne || data?.entreprise_raison_sociale || "";
};

export const remoteEtablissementLabelGetterFromFormation = (data) => {
  if (!data || !Object.keys(data)?.length) return "";
  return (
    data?.etablissement_formateur_entreprise_raison_sociale ||
    data?.etablissement_formateur_enseigne ||
    data?.etablissement_gestionnaire_enseigne ||
    data?.etablissement_gestionnaire_entreprise_raison_sociale ||
    ""
  );
};

// Vérifie si le SIRET est valide à travers sa longueur et l'algorythme de Luhn
export const isValidSIRET = (siret) => {
  if (!siret) {
    return false;
  }
  if (!/^\d{14}$/.test(siret)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < siret.length; i++) {
    let number = parseInt(siret[i]);

    if (i % 2 === 0) {
      number *= 2;

      if (number > 9) {
        number -= 9;
      }
    }

    sum += number;
  }

  return sum % 10 === 0;
};

export const buildEtablissementAddress = (etablissement) => {
  return `${etablissement.numeroVoie ? etablissement.numeroVoie : ""} ${
    etablissement.typeVoie ? etablissement.typeVoie : ""
  } ${etablissement.nomVoie ? etablissement.nomVoie : ""} ${
    etablissement.codePostal ? etablissement.codePostal : ""
  } ${etablissement.localite ? etablissement.localite : ""}`;
};

export const capitalizeFirstWord = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
