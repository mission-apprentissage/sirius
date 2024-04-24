const sinon = require("sinon");
const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newCampagne, newEtablissement, newFormation } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  it("should return 200 with multiple campagnes if it exists", async () => {
    const { httpClient, components } = await startServer();

    const campagne1 = newCampagne();
    const campagne2 = newCampagne({ nomCampagne: "Campagne 2" });

    const createdCampagne1 = await components.campagnes.create(campagne1);
    const createdCampagne2 = await components.campagnes.create(campagne2);

    const formation1 = newFormation({ campagneId: createdCampagne1._id });
    const formation2 = newFormation({ campagneId: createdCampagne2._id });

    const createdFormation1 = await components.formations.create(formation1);
    const createdFormation2 = await components.formations.create(formation2);

    const etablissement = newEtablissement({
      formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
      "data.siret": "30540504500017",
    });

    await components.etablissements.create(etablissement);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient, true);

    const response = await httpClient
      .get(`/api/campagnes?siret=30540504500017`)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body.body[0]).to.deep.includes(campagne1);
    expect(response.body.body[1]).to.deep.includes(campagne2);
  });
  it("should return 200 and an empty array if no campagne exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    expect(response.status).to.eql(200);
    expect(response.body.body).to.eql([]);
  });
});
