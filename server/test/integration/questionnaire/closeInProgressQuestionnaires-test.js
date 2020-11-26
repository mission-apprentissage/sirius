const assert = require("assert");
const moment = require("moment");
const integrationTests = require("../utils/integrationTests");
const createFakeMailer = require("../utils/fakeMailer");
const { newApprenti, newContrat, newQuestionnaire } = require("../utils/fixtures");
const closeInProgressQuestionnaires = require("../../../src/questionnaires/closeInProgressQuestionnaires");

integrationTests(__filename, ({ getComponents }) => {
  it("Vérifie qu'un questionnaire en cours est fermé au bout d'un mois", async () => {
    let emails = [];
    let { db } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                status: "inprogress",
                updateDate: moment().subtract(2, "months").toDate(),
              }),
            ],
          }),
        ],
      })
    );

    let stats = await closeInProgressQuestionnaires(db);

    assert.deepStrictEqual(stats, {
      updated: 1,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    assert.strictEqual(questionnaire.status, "closed");
  });

  it("Vérifie qu'un questionnaire en cours mais récent n'est pas fermé", async () => {
    let emails = [];
    let { db } = await getComponents({
      mailer: createFakeMailer({ calls: emails }),
    });
    await db.collection("apprentis").insertOne(
      newApprenti({
        email: "apprenti@domain.fr",
        contrats: [
          newContrat({
            questionnaires: [
              newQuestionnaire({
                status: "inprogress",
                updateDate: Date.now(),
              }),
            ],
          }),
        ],
      })
    );

    let stats = await closeInProgressQuestionnaires(db);

    assert.deepStrictEqual(stats, {
      updated: 0,
    });

    let found = await db.collection("apprentis").findOne();
    let questionnaire = found.contrats[0].questionnaires[0];
    assert.strictEqual(questionnaire.status, "inprogress");
  });
});
