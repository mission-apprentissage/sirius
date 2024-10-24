const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");
const { expect } = require("chai");

httpTests(__filename, ({ startServer }) => {
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  it("should return 201, create a campagne and return it", async () => {
    const { httpClient } = await startServer();
    const campagne = newCampagne();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    expect(response.status).to.eql(201);
    expect(response.body).to.deep.includes(campagne);
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const campagne = { nomCampagne: "" };

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    expect(response.status).to.eql(400);
    expect(response.body).to.deep.includes({
      details: [
        {
          context: {
            key: "startDate",
            label: "startDate",
          },
          message: '"startDate" is required',
          path: ["startDate"],
          type: "any.required",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
