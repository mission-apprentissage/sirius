const assert = require("assert");
const { omit } = require("lodash");
const integrationTests = require("../utils/integrationTests");
const logger = require("../utils/fakeLogger");
const createFakeMailer = require("../utils/fakeMailer");
const { newContrat } = require("../utils/fixtures");
const sendQuestionnaires = require("../../../src/questionnaires/jobs/sendQuestionnaires/sendQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'on peut envoyer un questionnaire", async () => {
    let emails = [];
    let { db, questionnaires } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("contrats").insertOne(
      newContrat({
        apprenti: {
          email: "test@domain.com",
        },
      })
    );

    let stats = await sendQuestionnaires(db, logger, questionnaires);

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
      nbEmailsSent: 1,
      token,
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
    assert.strictEqual(emails.length, 1);
  });
});
