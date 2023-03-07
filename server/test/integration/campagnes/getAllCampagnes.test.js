const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 with multiple campagnes if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne1 = newCampagne();
    const campagne2 = newCampagne({ nomCampagne: "Campagne 2" });

    await components.campagnes.create(campagne1);
    await components.campagnes.create(campagne2);

    const response = await httpClient.get("/api/campagnes/");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, [
      { ...campagne1, _id: response.data[0]._id, __v: 0 },
      { ...campagne2, _id: response.data[1]._id, __v: 0 },
    ]);
  });
  it("should return 200 and an empty array if no campagne exist", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/campagnes/");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, []);
  });
});
