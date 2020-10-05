const assert = require("assert");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const createFakeMailer = require("../utils/fakeMailer");
const { newApprenti, newContrat, newQuestionnaire } = require("../utils/fixtures");
const resendQuestionnaires = require("../../../src/questionnaires/emails/resendQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut renvoyer un questionnaire de fin d'année", async () => {
    let sendDate = new Date();
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finAnnee", status: "sent", sendDates: [sendDate] })],
          }),
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    let token = questionnaire.token;
    assert.deepStrictEqual(questionnaire.sendDates[0], sendDate);
    assert.strictEqual(questionnaire.sendDates.length, 2);
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
    assert.strictEqual(email.to, "test@domain.com");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
  });

  it("Vérifie qu'on peut renvoyer un questionnaire de fin de formation", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finFormation", status: "sent", sendDates: [new Date()] })],
          }),
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 1,
      sent: 1,
      failed: 0,
      ignored: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    let token = questionnaire.token;
    assert.strictEqual(questionnaire.sendDates.length, 2);
    assert.deepStrictEqual(omit(questionnaire, ["sendDates"]), {
      type: "finFormation",
      status: "sent",
      token,
      questions: [],
    });

    //Check emails
    assert.strictEqual(emails.length, 1);
    let email = emails[0];
    assert.strictEqual(email.from, "sirius@apprentissage.beta.gouv.fr");
    assert.strictEqual(email.to, "test@domain.com");
    assert.strictEqual(email.subject, "Que pensez-vous de votre formation CAP Boucher ?");
    assert.ok(email.html.lastIndexOf("Donnez votre avis") !== -1);
    assert.ok(email.html.lastIndexOf(`http://localhost:5000/questionnaires/${token}`) !== -1);
  });

  it("Vérifie qu'on peut renvoyer plusieurs questionnaires de différents types", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({ type: "finAnnee", token: "12345" }),
              newQuestionnaire({ type: "finFormation", token: "45612" }),
            ],
          }),
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 2,
      sent: 2,
      failed: 0,
      ignored: 0,
    });

    //Check emails
    assert.strictEqual(emails.length, 2);
  });

  it("Vérifie qu'on peut renvoyer qu'une seule fois un questionnaire", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({ type: "finAnnee", sendDates: [new Date(), new Date()], status: "sent" }),
            ],
          }),
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 0,
      sent: 0,
      failed: 0,
      ignored: 0,
    });
    assert.strictEqual(emails.length, 0);
  });

  it("Vérifie que les questionnaires terminés ne sont pas renvoyés", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finAnnee", status: "closed" })],
          }),
        ],
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.strictEqual(emails.length, 0);
    assert.deepStrictEqual(stats, {
      total: 0,
      sent: 0,
      failed: 0,
      ignored: 0,
    });
  });

  it("Vérifie que lors d'un renvoi le statut est préservé", async () => {
    let { db, questionnaires } = await getComponents();
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "test@domain.com",
        contrats: [
          newContrat({
            questionnaires: [newQuestionnaire({ type: "finAnnee", status: "open" })],
          }),
        ],
      })
    );

    await resendQuestionnaires(db, logger, questionnaires);

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    assert.strictEqual(questionnaire.status, "open");
  });

  it("Vérifie qu'on ignore les apprentis qui se sont désinscrits", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        unsubscribe: true,
      })
    );

    let stats = await resendQuestionnaires(db, logger, questionnaires);

    assert.deepStrictEqual(stats, {
      total: 0,
      sent: 0,
      failed: 0,
      ignored: 0,
    });
  });
});
