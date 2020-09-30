let niveaux = {
  "400": 0,
  "403": 0,
  "464": 0,
  "500": 0,
  "560": 0,
  "463": 0,
  "26X": 0,
  "320": 0,
  "563": 0,
  "46A": 0,
  "46T": 0,
  "323": 0,
  "450": 0,
};

module.exports = (contrat) => {
  if (!contrat.formation.codeDiplome) {
    return false;
  }

  let niveau = contrat.formation.codeDiplome.substring(0, 3);
  return niveaux[niveau] === undefined || niveaux[niveau]++ < 100;
};
