module.exports = (db) => {
  return {
    create: ({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI }) => {
      return db
        .collection("campagnes")
        .insertOne({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI });
    },
  };
};
