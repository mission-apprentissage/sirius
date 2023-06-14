const assert = require("assert");
const sinon = require("sinon");

const httpTests = require("../utils/httpTests");
const { newTemoignage, newCampagne } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  before(async () => {
    sinon.useFakeTimers();
  });
  after(async () => {
    sinon.restore();
  });
  it("should return 200 with multiple temoignages if it exists", async () => {
    const { httpClient, components } = await startServer();
    const temoignage1 = newTemoignage();
    const temoignage2 = newTemoignage();

    await components.temoignages.create(temoignage1);
    await components.temoignages.create(temoignage2);

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/temoignages/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, [
      {
        ...temoignage1,
        _id: response.body[0]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        ...temoignage2,
        _id: response.body[1]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ]);
  });
  it("should return 200 and an empty array if no temoignage exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/temoignages/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, []);
  });
  it("should return 200 with multiple temoignages belonging to a unique camapgne if campagneId is in query params", async () => {
    const { httpClient, components } = await startServer();
    const campagne1 = newCampagne({}, true);

    const temoignage1 = newTemoignage({ campagneId: campagne1._id.toString() });
    const temoignage2 = newTemoignage({ campagneId: campagne1._id.toString() });
    const temoignage3 = newTemoignage();

    await components.temoignages.create(temoignage1);
    await components.temoignages.create(temoignage2);
    await components.temoignages.create(temoignage3);

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .get("/api/temoignages/")
      .query({ campagneId: temoignage1.campagneId })
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, [
      {
        ...temoignage1,
        _id: response.body[0]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
      {
        ...temoignage2,
        _id: response.body[1]._id,
        __v: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: null,
      },
    ]);
  });
});
