module.exports = (db) => {
  return {
    unsubscribe: (email) => {
      return db.collection("apprentis").updateMany(
        { "contrats.entreprise.email": email },
        {
          $set: {
            "contrats.$[c].entreprise.unsubscribe": true,
          },
        },
        {
          arrayFilters: [
            {
              "c.entreprise.email": email,
            },
          ],
        }
      );
    },
  };
};
