const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db, logger, httpClient) => {
  let stream = db
    .collection("apprentis")
    .aggregate([
      { $unwind: "$contrats" },
      {
        $project: {
          cfa: "$contrats.cfa",
        },
      },
      {
        $match: {
          "cfa.uaiFormateur": { $ne: null },
          "cfa.codePostal": { $exists: true },
        },
      },
      {
        $group: {
          _id: {
            uaiFormateur: "$cfa.uaiFormateur",
          },
          cfa: { $first: "$cfa" },
        },
      },
    ])
    .stream();
  let stats = { total: 0, found: 0 };

  await oleoduc(
    stream,
    transformObject(
      async ({ cfa }) => {
        stats.total++;

        let response = await httpClient.get(
          "https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod/etablissements",
          {
            params: {
              query: {
                num_departement: cfa.codePostal.substring(0, 2),
                //code_postal: cfa.codePostal,
                uai: cfa.uaiFormateur,
              },
            },
          }
        );

        return { cfa, found: response.data.pagination.total > 0 };
      },
      { parallel: 10 }
    ),
    writeObject(
      ({ cfa, found }) => {
        if (found) {
          stats.found++;
        } else {
          logger.warn(`CFA introuvable`, { cfa });
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
