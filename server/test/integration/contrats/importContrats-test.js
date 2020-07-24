const assert = require("assert");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const importContrats = require("../../../src/contrats/jobs/importContrats/importContrats");
const { createStream } = require("../utils/testUtils");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifique qu'on peut importer des contrats", async () => {
    let { db } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(db, logger, stream);

    let found = await db.collection("contrats").findOne();
    assert.deepStrictEqual(stats, {
      total: 1,
      imported: 1,
      failed: 0,
    });
    assert.ok(found.creationDate);
    assert.deepStrictEqual(omit(found, ["_id", "creationDate"]), {
      apprenti: {
        prenom: "HENRI",
        nom: "ROBERT",
        email: "email@apprenti.fr",
        telephones: { fixe: null, portable: null },
      },
      formation: {
        code_diplome: "11111111",
        intitule: "Licence professionnelle Management",
        annee_promotion: null,
        periode: { debut: new Date("2019-11-25T00:00:00.000Z"), fin: new Date("2020-09-13T00:00:00.000Z") },
      },
      cfa: { uai_responsable: "1111111D", uai_formateur: "2222222D", adresse: "31 rue des lilas 75001 Paris" },
      rupture: null,
      entreprise: { raisonSociale: null, siret: "11111111100027", tuteur: { prenom: "Jacques", nom: "HENRI" } },
      questionnaires: [],
      unsubscribe: false,
    });
  });

  it("Vérifie qu'on ne peut pas importer un contrat en double", async () => {
    let { db } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(db, logger, stream);

    let count = await db.collection("contrats").countDocuments();
    assert.strictEqual(count, 1);
    assert.deepStrictEqual(stats, {
      total: 2,
      imported: 1,
      failed: 1,
    });
  });

  it("Vérifie que les lignes invalides sont rejetées", async () => {
    let { db } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"Invalid"`
    );

    let stats = await importContrats(db, logger, stream);

    let count = await db.collection("contrats").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      imported: 0,
      failed: 1,
    });
  });
});
