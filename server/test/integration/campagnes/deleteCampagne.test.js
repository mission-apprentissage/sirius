const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the campagne if it exists", async () => {
    const { httpClient, components } = await startServer();
    const campagne = newCampagne();

    const createdCampagne = await components.campagnes.create(campagne);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes/" + createdCampagne._id)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.deep.includes({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 401 if campagne does not exist as the user can not access it", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes/5f7b5c5d0f7e0e2b9c7a7f1c")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(401);
    expect(response.body).to.deep.includes({ error: "Unauthorized", message: "Unauthorized", statusCode: 401 });
  });
});
