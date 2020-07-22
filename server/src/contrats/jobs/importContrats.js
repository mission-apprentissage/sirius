const env = require("env-var");
const { isEmpty } = require("lodash");
const csv = require("csv-parser");
const moment = require("moment");
const { createReadStream } = require("fs");
const { oleoduc, writeObject } = require("oleoduc");
const runScript = require("../../core/runScript");
const validateContrat = require("../validateContrat");

let sanitize = (value) => {
  let res = value.replace(/[ .,]/g, "").replace(/[^\x00-\xA0]/g, "");
  return isEmpty(res) ? null : res;
};

runScript(async ({ db, logger }) => {
  const file = env.get("FILE").default(0).asString();
  let stats = {
    total: 0,
    imported: 0,
    failed: 0,
  };

  await oleoduc(
    createReadStream(file),
    csv({
      separator: "|",
      mapHeaders: ({ header }) =>
        header
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/ /g, "_"),
    }),
    writeObject(
      async (data) => {
        try {
          stats.total++;
          let contrat = {
            apprenti: {
              prenom: data.prenom_apprenti,
              nom: data.nom_apprenti,
              email: data.email_apprenti,
              creationDate: new Date(),
              telephones: {
                fixe: sanitize(data.telephone_apprenti),
                portable: sanitize(data.portable_apprenti),
              },
            },
            formation: {
              code_diplome: sanitize(data.code_diplome),
              intitule: data.app_diplome,
              annee_promotion: data.annee_promotion || null,
              periode:
                data.date_debut && data.date_fin
                  ? {
                      debut: data.date_debut ? moment(data.date_debut, "DD-MM-YYYY").toDate() : null,
                      fin: data.date_fin ? moment(data.date_fin, "DD-MM-YYYY").toDate() : null,
                    }
                  : null,
            },
            cfa: {
              uai_responsable: sanitize(data.code_uai_cfa),
              uai_formateur: sanitize(data.code_uai_site),
              adresse: data.adresse_postale_cfa,
            },
            rupture: data.date_rupture ? moment(data.date_rupture, "DD-MM-YYYY").toDate() : null,
            entreprise: {
              raisonSociale: isEmpty ? null : data.entreprise,
              siret: sanitize(data.siret_entreprise),
              tuteur:
                data.prenom_tuteur && data.nom_tuteur
                  ? {
                      prenom: data.prenom_tuteur,
                      nom: data.nom_tuteur,
                    }
                  : null,
            },
            questionnaires: [],
          };

          let validated = await validateContrat(contrat);

          await db.collection("contrats").insertOne(validated);

          stats.imported++;
        } catch (e) {
          logger.error(e);
          stats.failed++;
        }
      },
      { parallel: 10 }
    )
  );

  return stats;
});
