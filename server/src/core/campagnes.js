module.exports = (db) => {
  return {
    getAll: () => {
      return db.collection("campagnes").find({}).toArray();
    },
    create: ({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI }) => {
      return db
        .collection("campagnes")
        .insertOne({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI });
    },
  };
};
