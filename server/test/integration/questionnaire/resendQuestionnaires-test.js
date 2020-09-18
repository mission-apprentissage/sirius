const assert = require("assert");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const createFakeMailer = require("../utils/fakeMailer");
const { newContrat } = require("../utils/fixtures");
const resendQuestionnaires = require("../../../src/questionnaires/emails/resendQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut renvoyer un questionnaire de fin d'année", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [{ type: "finAnnee", nbEmailsSent: 1, status: "sent", token: "12345", reponses: [] }],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
    });

    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[0];
    let token = questionnaire.token;
    assert.ok(questionnaire.sentDate);
    assert.deepStrictEqual(omit(questionnaire, ["sentDate"]), {
      type: "finAnnee",
      status: "sent",
      token,
      nbEmailsSent: 2,
      reponses: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "test@domain.com");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis en 3 minutes") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
  });

  it("Vérifie qu'on peut renvoyer un questionnaire de fin de formation", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [{ type: "finFormation", nbEmailsSent: 1, status: "sent", token: "45612", reponses: [] }],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
    });

    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[0];
    let token = questionnaire.token;
    assert.ok(questionnaire.sentDate);
    assert.deepStrictEqual(omit(questionnaire, ["sentDate"]), {
      type: "finFormation",
      status: "sent",
      token,
      nbEmailsSent: 2,
      reponses: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "test@domain.com");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis en 3 minutes") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
  });

  it("Vérifie qu'on peut renvoyer plusieurs questionnaires de différents types", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [
          { type: "finAnnee", nbEmailsSent: 1, status: "sent", token: "12345", reponses: [] },
          { type: "finFormation", nbEmailsSent: 1, status: "sent", token: "45612", reponses: [] },
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 2,
      sent: 2,
      failed: 0,
    });

    //Check emails
    assert.strictEqual(emails.length, 2);
  });

  it("Vérifie qu'on peut renvoyer qu'une seule fois un questionnaire", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [{ type: "finAnnee", nbEmailsSent: 2, status: "sent", token: "12345", reponses: [] }],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 0,
      sent: 0,
      failed: 0,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie que les questionnaires terminés ne sont pas renvoyés", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [{ type: "finAnnee", nbEmailsSent: 1, status: "closed", token: "12345", reponses: [] }],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.strictEqual(emails.length, 0);
    assert.deepStrictEqual(stats, {
      total: 0,
      sent: 0,
      failed: 0,
    });
  });

  it("Vérifie que lors d'un renvoi le statut est préservé", async () => {
    let { db, questionnaires } = await getComponents();
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
        questionnaires: [{ type: "finAnnee", nbEmailsSent: 1, status: "open", token: "12345", reponses: [] }],
      })
    );

    await resendQuestionnaires(db, logger, questionnaires);

    let found = await db.collection("contrats").findOne();
    let questionnaire = found.questionnaires[0];
    assert.strictEqual(questionnaire.status, "open");
  });
});
