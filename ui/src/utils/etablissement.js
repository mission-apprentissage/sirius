export const etablissementLabelGetter = (data) => {
  if (!data || !Object.keys(data)?.length) return "";
  return data?.onisep_nom || data?.enseigne || data?.entreprise_raison_sociale || "";
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
