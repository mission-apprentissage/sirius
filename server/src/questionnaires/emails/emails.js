const path = require("path");

const getEmailTemplate = (type) => path.join(__dirname, `${type}.mjml.ejs`);

module.exports = {
  finAnnee: ({ apprenti, contrat }) => {
    return {
      template: getEmailTemplate(`finAnnee`),
      emailAddress: apprenti.email,
      subject: `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
    };
  },
  finFormation: ({ apprenti, contrat }) => {
    return {
      template: getEmailTemplate(`finFormation`),
      emailAddress: apprenti.email,
      subject: `Que pensez-vous de votre formation ${contrat.formation.intitule} ?`,
    };
  },
  tuteur: ({ contrat }) => {
    return {
      template: getEmailTemplate(`tuteur`),
      emailAddress: contrat.entreprise.email,
      subject: `${contrat.entreprise.tuteur.prenom} ${contrat.entreprise.tuteur.nom} : votre avis sur le CFA ${contrat.cfa.nom}`,
    };
  },
};
