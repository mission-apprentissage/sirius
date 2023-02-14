const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the campagne if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne = newCampagne();
    const createdCampagne = await components.campagnesController.create(campagne);

    const response = await httpClient.delete("/api/campagnes/" + createdCampagne.ops[0]._id);

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      message: "ok",
    });
  });
  it("should return 404 if campagne does not exist", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.delete("/api/campagnes/5f7b5c5d0f7e0e2b9c7a7f1c");

    assert.strictEqual(response.status, 404);
    assert.deepStrictEqual(response.data, {
      error: "Not Found",
      message: "Campagne inconnue",
      statusCode: 404,
    });
  });
});
