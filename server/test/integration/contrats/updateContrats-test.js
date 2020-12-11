const assert = require("assert");
const { omit } = require("lodash");
const { newApprenti, newContrat } = require("../utils/fixtures");
const integrationTests = require("../utils/integrationTests");
const updateContrats = require("../../../src/contrats/updateContrats");
const { createStream } = require("../utils/testUtils");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut mettre à jour les données d'un contrat et de l'apprenti", async () => {
    let { db, logger } = await getComponents();
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "john@doe.com",
        contrats: [
          newContrat({
            formation: {
              codeDiplome: "11111111",
            },
            cfa: {
              siret: "22222222200014",
            },
            entreprise: {
              siret: "11111111100027",
            },
          }),
        ],
      })
    );

    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"john@doe.com"|||"Dodo"|"John"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Nouvelle Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );
    let stats = await updateContrats(db, logger, stream);

    let found = await db.collection("apprentis").findOne({ email: "john@doe.com" });
    assert.deepStrictEqual(omit(found, ["_id", "creationDate", "telephones", "cohorte"]), {
      prenom: "John",
      nom: "Dodo",
      email: "john@doe.com",
      unsubscribe: false,
      contrats: [
        {
          questionnaires: [],
          formation: {
            codeDiplome: "11111111",
            intitule: "Licence professionnelle Management",
            anneePromotion: null,
            periode: { debut: new Date("2019-11-25T00:00:00.000Z"), fin: new Date("2020-09-13T00:00:00.000Z") },
          },
          cfa: {
            nom: "CFA",
            siret: "22222222200014",
            uaiResponsable: "1111111D",
            uaiFormateur: "2222222D",
            adresse: "31 rue des lilas 75001 Paris",
            codePostal: "75001",
          },
          rupture: null,
          entreprise: {
            raisonSociale: "Nouvelle Entreprise",
            siret: "11111111100027",
            email: "email@entreprise.fr",
            tuteur: { prenom: "Jacques", nom: "HENRI" },
          },
        },
      ],
    });
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 1,
      failed: 0,
    });
  });

  it("Vérifie que les autres contrats ne sont pas impactés", async () => {
    let { db, logger } = await getComponents();
    let untouched = newApprenti({
      email: "john@doe.com",
      contrats: [newContrat()],
    });
    await db.collection("apprentis").insertOne(untouched);

    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"john@doe.com"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Nouvelle Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );
    let stats = await updateContrats(db, logger, stream);

    let found = await db.collection("apprentis").findOne({ email: "john@doe.com" });
    assert.deepStrictEqual(found, untouched);
    assert.deepStrictEqual(stats, {
      total: 1,
      updated: 0,
      failed: 0,
    });
  });
});
