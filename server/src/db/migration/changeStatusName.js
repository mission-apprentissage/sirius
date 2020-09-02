const { oleoduc, writeObject } = require("oleoduc");
const { getNbModifiedDocuments } = require("../../core/mongoUtils");

module.exports = async (db) => {
  let stats = {
    updated: 0,
  };

  let inputStream = db.collection("contrats").find({ "questionnaires.status": "opened" }).stream();

  await oleoduc(
    inputStream,
    writeObject(
      async (doc) => {
        let results = await db.collection("contrats").updateOne(
          { _id: doc._id },
          {
            $set: {
              "questionnaires.$[].status": "clicked",
            },
          }
        );
        stats.updated += getNbModifiedDocuments(results);
      },
      { parallel: 10 }
    )
  );

  return stats;
};
