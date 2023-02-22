const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newTemoignage } = require("../utils/fixtures");

httpTests(__filename, ({ startServer }) => {
  it("should return 201, create a temoignage and return it", async () => {
    const { httpClient } = await startServer();
    const temoignage = newTemoignage();

    const response = await httpClient.post("/api/temoignages/", temoignage);

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(response.data, {
      ...temoignage,
      _id: response.data._id,
      __v: 0,
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const temoignage = { campagneId: "" };
    const response = await httpClient.post("/api/temoignages/", temoignage);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.data, {
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
