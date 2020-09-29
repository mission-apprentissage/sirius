const assert = require("assert");
const { newContrat } = require("../utils/fixtures");
const integrationTests = require("../utils/integrationTests");
const updateContrats = require("../../../src/apprentis/mfr/updateContrats");
const { createStream } = require("../utils/testUtils");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut mettre à jour les données d'un contrat", async () => {
    let { db, logger } = await getComponents();
    await db.collection("apprentis").insertOne(
      newContrat({
        email: "jean@robert.com",
        contrats: [
          {
            formation: {
              codeDiplome: "11111111",
            },
            cfa: {
              siret: "22222222200014",
              uaiResponsable: "1111111D",
              uaiFormateur: "2222222D",
              adresse: "31 rue des lilas 75001 Paris",
            },
            entreprise: {
              siret: "11111111100027",
            },
          },
        ],
      })
    );
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"jean@robert.com"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await updateContrats(db, logger, stream);

    let found = await db.collection("apprentis").findOne({ email: "jean@robert.com" });
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 1,
      failed: 0,
    });
    assert.deepStrictEqual(found.contrats[0].cfa, {
      nom: "CFA",
      siret: "22222222200014",
      uaiResponsable: "1111111D",
      uaiFormateur: "2222222D",
      adresse: "31 rue des lilas 75001 Paris",
      codePostal: "75001",
    });
  });
});
