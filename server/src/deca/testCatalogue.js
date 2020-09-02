const axios = require("axios");
const { oleoduc, transformObject, writeObject } = require("oleoduc");

module.exports = async (db, logger) => {
  let stream = db.collection("contrats").find().stream();
  let stats = { total: 0, found: 0 };

  await oleoduc(
    stream,
    transformObject(
      async (contrat) => {
        let { cfa, formation } = contrat;
        stats.total++;

        let matched = cfa.adresse.match(/([0-9]{5})|([0-9]{2} [0-9]{3})/);
        let codePostal = matched && matched.length > 0 ? matched[0].replace(/ /g, "") : null;

        let response = await axios.get("https://c7a5ujgw35.execute-api.eu-west-3.amazonaws.com/prod/formations", {
          params: {
            query: {
              educ_nat_code: formation.code_diplome,
              ...(codePostal ? { code_postal: codePostal } : {}),
              $or: [
                { etablissement_formateur_siret: cfa.siret },
                { etablissement_formateur_uai: cfa.uai_formateur },
                { etablissement_responsable_uai: cfa.uai_responsable },
                { etablissement_responsable_siret: cfa.siret },
              ],
            },
          },
        });

        return { contrat, found: response.data.pagination.total > 0 };
      },
      { parallel: 10 }
    ),
    writeObject(
      (result) => {
        let { cfa, formation } = result.contrat;
        if (result.found) {
          stats.found++;
          logger.info(
            `Formation ${formation.code_diplome} dispensée par le cfa ${cfa.siret} trouvée dans le catalogue`
          );
        } else {
          logger.warn(
            `Pas de reconciliation pour la formation ${formation.code_diplome} dispensée par le cfa ${cfa.siret}`
          );
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
};
