const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newTemoignage } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
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
      { ...temoignage1, _id: response.body[0]._id, __v: 0 },
      { ...temoignage2, _id: response.body[1]._id, __v: 0 },
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
});
