const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db, logger, httpClient) => {
  let stream = db
    .collection("contrats")
    .aggregate([
      {
        $group: {
          _id: {
            codeDiplome: "$formation.codeDiplome",
            siret: "$cfa.siret",
            codePostal: "$cfa.codePostal",
          },
          formation: { $first: "$formation" },
          cfa: { $first: "$cfa" },
          nbContrats: { $sum: 1 },
        },
      },
    ])
    .stream();
  let stats = { total: 0, found: 0 };

  await oleoduc(
    stream,
    transformObject(
      async ({ formation, cfa }) => {
        stats.total++;

        let response = await httpClient.get("https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod/formations", {
          params: {
            query: {
              educ_nat_code: { $regex: `^${formation.codeDiplome}`, $options: "ix" },
              ...(cfa.codePostal ? { code_postal: cfa.codePostal } : {}),
              //...(codePostal ? { num_departement: codePostal.substring(0, 2) } : {}),
              $or: [{ etablissement_formateur_uai: cfa.uaiFormateur }, { etablissement_formateur_siret: cfa.siret }],
            },
          },
        });

        return { formation, cfa, found: response.data.pagination.total > 0 };
      },
      { parallel: 10 }
    ),
    writeObject(
      ({ formation, cfa, found }) => {
        if (found) {
          stats.found++;
        } else {
          logger.warn(`Action de formation introuvable`, { formation, cfa });
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
