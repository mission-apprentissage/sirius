const assert = require("assert");
const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newTemoignage } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  it("should return 201, create a temoignage and return it", async () => {
    const { httpClient } = await startServer();
    const temoignage = newTemoignage();

    const response = await httpClient.post("/api/temoignages/").send(temoignage);

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(response.body, {
      ...temoignage,
      _id: response.body._id,
      __v: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const temoignage = { campagneId: "" };
    const response = await httpClient.post("/api/temoignages/").send(temoignage);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, {
      details: [
        {
          context: {
            key: "campagneId",
            label: "campagneId",
            value: "",
          },
          message: '"campagneId" is not allowed to be empty',
          path: ["campagneId"],
          type: "string.empty",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
