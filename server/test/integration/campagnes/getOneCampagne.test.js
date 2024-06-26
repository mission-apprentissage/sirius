const { expect } = require("chai");
const sinon = require("sinon");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");

httpTests(__filename, ({ startServer }) => {
  afterEach(async () => {
    sinon.restore();
  });
  it("should return 200 with one campagne if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne = newCampagne();
    const createdCampagne = await components.campagnes.create(campagne);

    const response = await httpClient.get("/api/campagnes/" + createdCampagne._id);

    expect(response.status).to.eql(200);
    expect(response.body).to.deep.includes(campagne);
  });
  it("should return 404 if campagne does not exist", async () => {
    const { httpClient } = await startServer();

    const response = await httpClient.get("/api/campagnes/5f7b5c5d0f7e0e2b9c7a7f1c");

    expect(response.status).to.eql(404);
    expect(response.body).to.deep.includes({
      error: "Not Found",
      message: "Campagne inconnue",
      statusCode: 404,
    });
  });
});
