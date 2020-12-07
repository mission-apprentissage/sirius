const path = require("path");

const getEmailTemplate = (type) => path.join(__dirname, `${type}.mjml.ejs`);

module.exports = {
  finAnnee: ({ apprenti, contrat }) => {
    return {
      to: apprenti.email,
      subject: `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
      template: getEmailTemplate(`finAnnee`),
    };
  },
  finFormation: ({ apprenti, contrat }) => {
    return {
      to: apprenti.email,
      subject: `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
      template: getEmailTemplate(`finFormation`),
    };
  },
  tuteur: ({ contrat }) => {
    return {
      to: contrat.entreprise.email,
      subject: `${contrat.entreprise.tuteur.prenom} ${contrat.entreprise.tuteur.nom} : votre avis sur le CFA ${contrat.cfa.nom}`,
      template: getEmailTemplate(`tuteur`),
    };
  },
};
