const assert = require("assert");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 201, create a campagne and return it", async () => {
    const { httpClient } = await startServer();
    const campagne = newCampagne();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    assert.strictEqual(response.status, 201);
    assert.deepStrictEqual(response.body, {
      ...campagne,
      _id: response.body._id,
      __v: 0,
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const campagne = { nomCampagne: "" };

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const response = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    assert.strictEqual(response.status, 400);
    assert.deepStrictEqual(response.body, {
      details: [
        {
          context: {
            key: "nomCampagne",
            label: "nomCampagne",
            value: "",
          },
          message: '"nomCampagne" is not allowed to be empty',
          path: ["nomCampagne"],
          type: "string.empty",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
