const assert = require("assert");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const importContrats = require("../../../src/contrats/importContrats");
const { createStream } = require("../utils/testUtils");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut importer un nouvel apprenti et son contrat", async () => {
    let { db, logger, apprentis } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(logger, apprentis, stream);

    let found = await db.collection("apprentis").findOne();
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 1,
      updated: 0,
      invalid: 0,
      duplicated: 0,
    });
    assert.ok(found.creationDate);
    assert.ok(found.cohorte.startsWith("cohorte_test_2"));
    assert.deepStrictEqual(omit(found, ["_id", "creationDate", "cohorte"]), {
      prenom: "HENRI",
      nom: "ROBERT",
      email: "email@apprenti.fr",
      telephones: { fixe: null, portable: null },
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
          entreprise: {
            raisonSociale: "Entreprise",
            siret: "11111111100027",
            email: "email@entreprise.fr",
            tuteur: { prenom: "Jacques", nom: "HENRI" },
          },
          rupture: null,
        },
      ],
    });
  });

  it("Vérifie qu'on peut importer un nouvel apprenti et plusieurs contrats", async () => {
    let { db, logger, apprentis } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise 1"|11111111100027|||"email@entreprise1.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise 2"|11111111100030|||"email@entreprise2.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(logger, apprentis, stream);

    let found = await db.collection("apprentis").findOne();
    assert.deepStrictEqual(stats, {
      total: 2,
      created: 1,
      updated: 1,
      invalid: 0,
      duplicated: 0,
    });
    assert.ok(found.creationDate);
    assert.ok(found.cohorte.startsWith("cohorte_test_2"));
    assert.deepStrictEqual(omit(found, ["_id", "creationDate", "cohorte"]), {
      prenom: "HENRI",
      nom: "ROBERT",
      email: "email@apprenti.fr",
      telephones: { fixe: null, portable: null },
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
          entreprise: {
            raisonSociale: "Entreprise 1",
            siret: "11111111100027",
            email: "email@entreprise1.fr",
            tuteur: { prenom: "Jacques", nom: "HENRI" },
          },
          rupture: null,
        },
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
          entreprise: {
            raisonSociale: "Entreprise 2",
            siret: "11111111100030",
            email: "email@entreprise2.fr",
            tuteur: { prenom: "Jacques", nom: "HENRI" },
          },
          rupture: null,
        },
      ],
    });
  });

  it("Vérifie qu'on ne peut pas ignorer un contrat déjà importé", async () => {
    let { db, logger, apprentis } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"
"email@apprenti.fr"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(logger, apprentis, stream);

    let count = await db.collection("apprentis").countDocuments();
    assert.strictEqual(count, 1);
    assert.deepStrictEqual(stats, {
      total: 2,
      created: 1,
      updated: 0,
      invalid: 0,
      duplicated: 1,
    });
  });

  it("Vérifie que les lignes invalides sont rejetées", async () => {
    let { db, logger, apprentis } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"
"Invalid"`
    );

    let stats = await importContrats(logger, apprentis, stream);

    let count = await db.collection("apprentis").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 0,
      updated: 0,
      invalid: 1,
      duplicated: 0,
    });
  });

  it("Vérifie que les lignes avec des données invalides sont rejetées", async () => {
    let { db, logger, apprentis } = await getComponents();
    let stream = createStream(
      `"Email Apprenti"|"TÈlÈphone Apprenti"|"Portable Apprenti"|"Nom Apprenti"|"PrÈnom Apprenti"|"Code diplome"|"APP diplome"|"Date dÈbut"|"Date fin"|"Date rupture"|"Entreprise"|"Siret Entreprise"|"TÈlÈphone Entreprise"|"Portable Entreprise"|"Email Entreprise"|"Code APE/NAF"|"Nom tuteur"|"PrÈnom tuteur"|"Etablissement/site CFA"|"Siret"|"Code UAI CFA"|"Code UAI Site"|"Adresse Postale CFA"|||"ROBERT"|"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"
"email@apprenti.fr"||||"HENRI"|"11111111"|"Licence professionnelle Management"|25/11/2019|13/9/2020||"Entreprise"|11111111100027|||"email@entreprise.fr"|"4651Z"|"HENRI"|"Jacques"|"CFA"|"22222222200014"|"1111111D "|"2222222D "|"31 rue des lilas 75001 Paris"`
    );

    let stats = await importContrats(logger, apprentis, stream);

    let count = await db.collection("apprentis").countDocuments();
    assert.strictEqual(count, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      created: 0,
      updated: 0,
      invalid: 1,
      duplicated: 0,
    });
  });
});
