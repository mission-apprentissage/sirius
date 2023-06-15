const assert = require("assert");
const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

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

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, [
      {
        ...campagne1,
        _id: response.body[0]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        temoignagesCount: 0,
      },
      {
        ...campagne2,
        _id: response.body[1]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
        temoignagesCount: 0,
      },
    ]);
  });
  it("should return 200 and an empty array if no campagne exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, []);
  });
});
