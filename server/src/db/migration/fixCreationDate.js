const { oleoduc, writeObject } = require("oleoduc");
const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  let inputStream = db
    .collection("contrats")
    .find()
    .stream({ "apprenti.creationDate": { $exists: true } });

  await oleoduc(
    inputStream,
    writeObject(
      async (doc) => {
        let results = await db.collection("contrats").updateOne({ _id: doc._id }, [
          {
            $set: {
              creationDate: "$apprenti.creationDate",
              cohorte: "cohorte_test_q2_2020_07_23",
            },
          },
          { $unset: ["apprenti.creationDate"] },
        ]);
        stats.updated += getNbModifiedDocuments(results);
      },
      { parallel: 10 }
    )
  );

  return stats;
};
