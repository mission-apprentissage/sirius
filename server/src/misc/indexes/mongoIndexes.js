module.exports = {
  contrats: (db) => {
    return Promise.all([db.collection("contrats").createIndex({ "apprenti.email": 1 }, { unique: true })]);
  },
};
