const indexes = {
  apprentis: (db) => {
    return Promise.all([db.collection("apprentis").createIndex({ email: 1 }, { unique: true })]);
  },
};

const capLogs = async (db) => {
  let collections = await db.listCollections().toArray();
  if (!collections.map((c) => c.name).find((name) => name === "logs")) {
    await db.createCollection("logs");
  }

  await db.command({ convertToCapped: "logs", size: 1000000000 });
};

module.exports = async (db, collectionNames) => {
  let results = await Promise.all(
    Object.keys(indexes)
      .filter((key) => !collectionNames || collectionNames.includes(key))
      .map((key) => indexes[key](db))
  );

  await capLogs(db);

  return {
    created: results.length + 1, //+ capped index,
  };
};
