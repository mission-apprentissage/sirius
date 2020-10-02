const { getNbModifiedDocuments } = require("../../core/mongoUtils");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };
  let sanitize = (value) => {
    return !value
      ? value
      : value
          .replace(/È/g, "é")
          .replace(/Ë/g, "è")
          .replace(/Ù/g, "ô")
          .replace(/…/g, "É")
          .replace(/Î/g, "ë")
          .replace(/Ó/g, "î")
          .replace(/ª´/g, "")
          .replace(/b‚t/g, "bât")
          .replace(/l\?/g, "l'")
          .replace(/ \? /g, " ");
  };

  await oleoduc(
    db.collection("apprentis").find(),
    transformObject((apprenti) => {
      apprenti.prenom = sanitize(apprenti.prenom);
      apprenti.nom = sanitize(apprenti.nom);
      apprenti.contrats = apprenti.contrats.map((c) => {
        c.formation.intitule = sanitize(c.formation.intitule);
        c.cfa.adresse = sanitize(c.cfa.adresse);
        c.cfa.nom = sanitize(c.cfa.nom);
        c.entreprise.raisonSociale = sanitize(c.entreprise.raisonSociale);
        if (c.entreprise.tuteur) {
          c.entreprise.tuteur.prenom = sanitize(c.entreprise.tuteur.prenom);
          c.entreprise.tuteur.nom = sanitize(c.entreprise.tuteur.nom);
        }
        return c;
      });
      return apprenti;
    }),
    writeObject(async (apprenti) => {
      let results = await db.collection("apprentis").replaceOne({ _id: apprenti._id }, apprenti);
      stats.updated += getNbModifiedDocuments(results);
    })
  );

  return stats;
};
