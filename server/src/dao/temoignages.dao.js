module.exports = (Temoignage) => {
  return {
    create: ({ campagneId, reponses }) => {
      return Temoignage.create({ campagneId, reponses });
    },
  };
};
