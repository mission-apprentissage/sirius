const assert = require("assert");
const moment = require("moment");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const createFakeMailer = require("../utils/fakeMailer");
const { newContrat } = require("../utils/fixtures");
const sendQuestionnaires = require("../../../src/questionnaires/emails/sendQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on envoie un questionnaire de fin d'année", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
        formation: {
          periode: {
            debut: moment().subtract(2, "years").toDate(),
            fin: moment().add(2, "years").toDate(),
          },
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[0];
    let token = questionnaire.token;
    assert.ok(questionnaire.sentDate);
    assert.deepStrictEqual(omit(questionnaire, ["sentDate"]), {
      type: "finAnnee",
      status: "sent",
      nbEmailsSent: 1,
      token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "apprenti@domain.fr");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis en 3 minutes") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on envoie un questionnaire de fin de formation", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
        formation: {
          periode: {
            debut: moment().subtract(2, "years").toDate(),
            fin: moment().subtract(1, "days").toDate(),
          },
        },
        questionnaires: [{ type: "finAnnee", nbEmailsSent: 1, status: "sent", token: "12345", reponses: [] }],
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[1];
    let token = questionnaire.token;
    assert.ok(questionnaire.sentDate);
    assert.deepStrictEqual(omit(questionnaire, ["sentDate"]), {
      type: "finFormation",
      status: "sent",
      nbEmailsSent: 1,
      token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "apprenti@domain.fr");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis en 3 minutes") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
    assert.strictEqual(emails.length, 1);
  });

  it("Vérifie qu'on ignore les apprentis et les contrats qui ne sont pas concernés", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
        formation: {
          periode: {
            debut: moment().subtract(1, "months").toDate(),
            fin: moment().add(1, "years").toDate(),
          },
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie qu'on marque un questionnaire qui n'a pas pu être envoyé", async () => {
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ fail: true }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 1,
      ignored: 0,
    });
    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[0];
    assert.ok(questionnaire.sentDate);
    assert.strictEqual(questionnaire.status, "error");
  });

  it("Vérifie qu'on peut limiter le nombre de questionnaires envoyés", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
        formation: {
          periode: {
            debut: moment().subtract(1, "years").toDate(),
            fin: moment().add(2, "years").toDate(),
          },
        },
      })
    );
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "other@domain.com",
        },
        formation: {
          periode: {
            debut: moment().subtract(1, "years").toDate(),
            fin: moment().add(2, "years").toDate(),
          },
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires, { limit: 1 });

    assert.strictEqual(emails.length, 1);
    assert.deepStrictEqual(stats, {
      total: 2,
      sent: 1,
      failed: 0,
      ignored: 1,
    });
  });

  it("Vérifie qu'on peut filtrer le type questionnaires envoyés", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "apprenti@domain.fr",
        },
        formation: {
          periode: {
            debut: moment().subtract(1, "years").toDate(),
            fin: moment().add(2, "years").toDate(),
          },
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires, { type: "finFormation" });

    assert.strictEqual(emails.length, 0);
    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 0,
      failed: 0,
      ignored: 1,
    });
  });
});
