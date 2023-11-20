const sinon = require("sinon");
const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
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

    await components.campagnes.create(campagne1);
    await components.campagnes.create(campagne2);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body[0]).to.deep.includes(campagne1);
    expect(response.body[1]).to.deep.includes(campagne2);
  });
  it("should return 200 and an empty array if no campagne exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.eql([]);
  });
});
