const assert = require("assert");
const moment = require("moment");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const createFakeMailer = require("../utils/fakeMailer");
const { newApprenti, newContrat, newQuestionnaire } = require("../utils/fixtures");
const sendQuestionnaires = require("../../../src/questionnaires/sendQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on envoie un questionnaire de fin d'année", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    let token = questionnaire.token;
    assert.strictEqual(questionnaire.sendDates.length, 1);
    assert.deepStrictEqual(omit(questionnaire, ["sendDates"]), {
      type: "finAnnee",
      status: "sent",
      token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "apprenti@domain.fr");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on peut envoyer un questionnaire de fin de formation", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finAnnee" })],
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().subtract(1, "days").toDate(),
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[1];
    assert.strictEqual(questionnaire.sendDates.length, 1);
    assert.deepStrictEqual(omit(questionnaire, ["sendDates"]), {
      type: "finFormation",
      status: "sent",
      token: questionnaire.token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "apprenti@domain.fr");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${questionnaire.token}`) !== -1);
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on peut envoyer un questionnaire au tuteur", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finAnnee" })],
            cfa: {
              nom: "Super CFA",
            },
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
            entreprise: {
              email: "contact@entreprise.fr",
              tuteur: {
                prenom: "John",
                nom: "Doe",
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[1];
    let token = questionnaire.token;
    assert.strictEqual(questionnaire.sendDates.length, 1);
    assert.deepStrictEqual(omit(questionnaire, ["sendDates"]), {
      type: "tuteur",
      status: "sent",
      token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "contact@entreprise.fr");
    assert.strictEqual(email.subject, "John Doe : votre avis sur le CFA Super CFA");
    assert.ok(email.html.lastIndexOf("Donnez votre avis") !== -1);
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on ignore les entreprises qui se sont désinscrits", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        contrats: [
          {
            questionnaires: [newQuestionnaire({ type: "finAnnee" })],
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
            entreprise: {
              email: "entreprise@domain.fr",
              unsubscribe: true,
            },
          },
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie qu'on marque un questionnaire qui n'a pas pu être envoyé", async () => {
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ fail: true }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 1,
      ignored: 0,
    });
    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    assert.strictEqual(questionnaire.sendDates.length, 1);
    assert.strictEqual(questionnaire.status, "error");
  });

  it("Vérifie qu'on peut limiter le nombre de questionnaires envoyés", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(1, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
          }),
        ],
      })
    );
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "other@domain.com",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(1, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires, { limit: 1 });

    assert.strictEqual(emails.length, 1);
    assert.deepStrictEqual(stats, {
      total: 2,
      sent: 1,
      failed: 0,
      ignored: 1,
    });
  });

  it("Vérifie qu'on peut filtrer le type de questionnaires envoyés", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(1, "years").toDate(),
                fin: moment().add(2, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires, { type: "finFormation" });

    assert.strictEqual(emails.length, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
  });

  it("Vérifie qu'on envoie un email pour le contrat le plus récent", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(4, "years").toDate(),
                fin: moment().subtract(3, "years").toDate(),
              },
            },
          }),
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().subtract(1, "years").toDate(),
              },
            },
          }),
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(5, "years").toDate(),
                fin: moment().subtract(4, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires, { type: "finFormation" });

    let found = await db.collection("apprentis").findOne();
    assert.deepStrictEqual(found.contrats[0].questionnaires.length, 0);
    assert.deepStrictEqual(found.contrats[1].questionnaires.length, 1);
    assert.deepStrictEqual(found.contrats[2].questionnaires.length, 0);

    //Check emails
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on ignore les contrats pas encore terminés", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(1, "months").toDate(),
                fin: moment().add(1, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie qu'on ignore les apprentis qui se sont désinscrits", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        unsubscribe: true,
      })
    );

    let stats = await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie qu'on prend en compte tous les questionnaires pour savoir s'il faut envoyer un email", async () => {
    let emails = [];
    let { db, workflow, apprentis, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finFormation" })],
            formation: {
              periode: {
                debut: moment().subtract(4, "years").toDate(),
                fin: moment().subtract(3, "years").toDate(),
              },
            },
          }),
          newContrat({
            formation: {
              periode: {
                debut: moment().subtract(2, "years").toDate(),
                fin: moment().subtract(1, "years").toDate(),
              },
            },
          }),
        ],
      })
    );

    await sendQuestionnaires(db, logger, workflow, apprentis, questionnaires, { type: "finFormation" });

    let found = await db.collection("apprentis").findOne();
    assert.deepStrictEqual(found.contrats[0].questionnaires.length, 1);
    assert.deepStrictEqual(found.contrats[1].questionnaires.length, 0);

    //Check emails
    assert.strictEqual(emails.length, 0);
  });
});
