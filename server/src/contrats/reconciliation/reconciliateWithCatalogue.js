const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db, logger, httpClient) => {
  let stream = db
    .collection("contrats")
    .aggregate([
      {
        $group: {
          _id: {
            codeDiplome: "$formation.codeDiplome",
            uaiResponsable: "$cfa.uaiResponsable",
            uaiFormateur: "$cfa.uaiFormateur",
            siretFormateur: "$cfa.siret",
            codePostal: "$cfa.codePostal",
          },
          nbContrats: { $sum: 1 },
        },
      },
    ])
    .stream();
  let stats = { total: 0, found: 0 };

  await oleoduc(
    stream,
    transformObject(
      async (res) => {
        let { codeDiplome, uaiResponsable, uaiFormateur, siretFormateur, codePostal } = res._id;
        stats.total++;

        let response = await httpClient.get("https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod/formations", {
          params: {
            query: {
              educ_nat_code: { $regex: `^${codeDiplome}`, $options: "ix" },
              //...(codePostal ? { code_postal: codePostal } : {}),
              ...(codePostal ? { num_departement: codePostal.substring(0, 2) } : {}),
              $or: [
                { etablissement_formateur_uai: uaiFormateur },
                { etablissement_formateur_siret: siretFormateur },
                { etablissement_responsable_siret: siretFormateur },
                { etablissement_responsable_uai: uaiResponsable },
              ],
            },
          },
        });

        return { res, found: response.data.pagination.total > 0 };
      },
      { parallel: 10 }
    ),
    writeObject(
      ({ res, found }) => {
        let { codeDiplome, uaiResponsable, uaiFormateur, siretFormateur, codePostal } = res._id;
        if (found) {
          stats.found++;
          logger.info(`[OK] ${codeDiplome} ${uaiResponsable} ${uaiFormateur} ${siretFormateur} ${codePostal}`);
        } else {
          logger.warn(`[KO] ${codeDiplome} ${uaiResponsable} ${uaiFormateur} ${siretFormateur} ${codePostal}`);
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
