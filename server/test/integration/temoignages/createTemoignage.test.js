const { expect } = require("chai");
const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newTemoignage, newCampagne } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  beforeEach(async () => {
    sinon.useFakeTimers(new Date());
  });
  afterEach(async () => {
    sinon.restore();
  });
  it("should return 201, create a temoignage and return it", async () => {
    const { httpClient, components } = await startServer();

    const campagne1 = newCampagne({}, false);
    const createdCampagne = await components.campagnes.create(campagne1);

    const temoignage = newTemoignage({ campagneId: createdCampagne._id.toString() });
    const response = await httpClient.post("/api/temoignages/").send(temoignage);

    expect(response.status).to.eql(201);
    expect(response.body).to.deep.includes(temoignage);
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const temoignage = { campagneId: "" };
    const response = await httpClient.post("/api/temoignages/").send(temoignage);

    expect(response.status).to.eql(400);
    expect(response.body).to.deep.includes({
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
