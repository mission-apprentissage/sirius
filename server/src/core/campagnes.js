const { ObjectID } = require("mongodb");

module.exports = (db) => {
  return {
    getAll: () => {
      return db.collection("campagnes").find({}).toArray();
    },
    getOne: (id) => {
      return db.collection("campagnes").findOne({ _id: ObjectID(id) });
    },
    create: ({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI }) => {
      return db
        .collection("campagnes")
        .insertOne({ nomCampagne, cfa, formation, startDate, endDate, questionnaire, questionnaireUI });
    },
    deleteOne: (id) => {
      return db.collection("campagnes").deleteOne({ _id: ObjectID(id) });
    },
  };
};
