const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newTemoignage } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the temoignage if it exists", async () => {
    const { httpClient, components } = await startServer();
    const temoignage = newTemoignage();

    const createdTemoignage = await components.temoignages.create(temoignage);

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/temoignages/" + createdTemoignage._id)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, {
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 404 if temoignage does not exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/temoignages/5f7b5c5d0f7e0e2b9c7a7f1c")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(response.body, {
      error: "Not Found",
      message: "Temoignage inconnu",
      statusCode: 404,
    });
  });
});
