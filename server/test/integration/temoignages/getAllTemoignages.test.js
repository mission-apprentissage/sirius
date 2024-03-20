const { expect } = require("chai");
const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newTemoignage, newCampagne, newQuestionnaire } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    sinon.useFakeTimers();
  });
  after(async () => {
    sinon.restore();
  });
  it("should return 200 with multiple temoignages if it exists", async () => {
    const { httpClient, components } = await startServer();

    const questionnaire = newQuestionnaire();
    const createdQuestionnaire = await components.questionnaires.create(questionnaire);

    const campagne1 = newCampagne({ questionnaireId: createdQuestionnaire._id });
    const createdCampagne = await components.campagnes.create(campagne1);

    const temoignage1 = newTemoignage({ campagneId: createdCampagne._id.toString() });
    const temoignage2 = newTemoignage({ campagneId: createdCampagne._id.toString() });

    await components.temoignages.create(temoignage1);
    await components.temoignages.create(temoignage2);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .get(`/api/temoignages?campagneId=${createdCampagne._id}`)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body[0]).to.deep.includes({
      ...temoignage1,
      lastQuestionAt: temoignage1.lastQuestionAt.toISOString(),
      deletedAt: null,
    });
    expect(response.body[1]).to.deep.includes({
      ...temoignage2,
      lastQuestionAt: temoignage2.lastQuestionAt.toISOString(),
      deletedAt: null,
    });
  });
  it("should return 200 and an empty array if no temoignage exist", async () => {
    const { httpClient, components } = await startServer();

    const questionnaire = newQuestionnaire();
    const createdQuestionnaire = await components.questionnaires.create(questionnaire);

    const campagne = newCampagne({ questionnaireId: createdQuestionnaire._id });
    const createdCampagne = await components.campagnes.create(campagne);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .get(`/api/temoignages?campagneId=${createdCampagne._id}`)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]);
  });
});
