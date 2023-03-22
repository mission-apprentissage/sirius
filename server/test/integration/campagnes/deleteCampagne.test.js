const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the campagne if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne = newCampagne();

    const createdCampagne = await components.campagnes.create(campagne);

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes/" + createdCampagne._id)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.body, {
      acknowledged: true,
      deletedCount: 1,
    });
  });
  it("should return 404 if campagne does not exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes/5f7b5c5d0f7e0e2b9c7a7f1c")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);
    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(response.body, {
      error: "Not Found",
      message: "Campagne inconnue",
      statusCode: 404,
    });
  });
});
