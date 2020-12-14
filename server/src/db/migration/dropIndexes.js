module.exports = async (db) => {
  let collections = await db.listCollections().toArray();

  let results = await Promise.all(
    collections.map((collection) => {
      return db.collection(collection.name).dropIndexes();
    })
  );

  return {
    dropped: results.length,
  };
};
