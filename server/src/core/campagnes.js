module.exports = (Campagne) => {
  return {
    getAll: () => {
      return Campagne.find({});
    },
    getOne: (id) => {
      return Campagne.findOne({ _id: id });
    },
    create: ({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI }) => {
      return Campagne.create({
        nomCampagne,
        cfa,
        formation,
        startDate,
        endDate,
        questionnaire,
        questionnaireUI,
      });
    },
    deleteOne: (id) => {
      return Campagne.deleteOne({ _id: id });
    },
  };
};
