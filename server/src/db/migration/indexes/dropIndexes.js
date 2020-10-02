module.exports = async (db) => {
  let collections = await db.listCollections().toArray();

  return Promise.all(
    collections
      .filter((collection) => collection.idIndex && collection.idIndex.ns.startsWith("sirius"))
      .map((collection) => db.collection(collection.name).dropIndexes())
  );
};
