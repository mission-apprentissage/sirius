const { oleoduc, writeObject } = require("oleoduc");

module.exports = async (db) => {
  let inputStream = db
    .collection("contrats")
    .find()
    .stream({ "apprenti.creationDate": { $exists: true } });

  oleoduc(
    inputStream,
    writeObject(
      (doc) => {
        db.collection("contrats").updateOne({ _id: doc._id }, [
          {
            $set: {
              creationDate: "$apprenti.creationDate",
              cohorte: "cohorte_test_q2_2020_07_23",
            },
          },
          { $unset: ["apprenti.creationDate"] },
        ]);
      },
      { parallel: 10 }
    )
  );
};
