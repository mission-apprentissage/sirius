module.exports = (db) => {
  return {
    create: ({ campagneId, reponses }) => {
      return db.collection("temoignages").insertOne({ campagneId, reponses });
    },
  };
};
