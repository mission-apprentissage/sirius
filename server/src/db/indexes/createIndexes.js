const indexes = {
  contrats: (db) => {
    return Promise.all([db.collection("apprentis").createIndex({ email: 1 }, { unique: true })]);
  },
};

module.exports = async (db, collectionNames) => {
  await Promise.all(
    Object.keys(indexes)
      .filter((key) => !collectionNames || collectionNames.includes(key))
      .map((key) => indexes[key](db))
  );
};
