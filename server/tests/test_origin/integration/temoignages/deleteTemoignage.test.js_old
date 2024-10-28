const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newTemoignage } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the temoignage if it exists and the user is admin", async () => {
    const { httpClient, components } = await startServer();
    const temoignage = newTemoignage();

    const createdTemoignage = await components.temoignages.create(temoignage);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient, true);

    const response = await httpClient
      .delete("/api/temoignages/" + createdTemoignage._id)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.eql({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 401 if the user is not admin", async () => {
    const { httpClient, components } = await startServer();
    const temoignage = newTemoignage();

    const createdTemoignage = await components.temoignages.create(temoignage);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/temoignages/" + createdTemoignage._id)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(401);
    expect(response.body).to.eql({
      error: "Unauthorized",
      message: "Unauthorized",
      statusCode: 401,
    });
  });
  it("should return 404 if temoignage does not exist", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient, true);

    const response = await httpClient
      .delete("/api/temoignages/5f7b5c5d0f7e0e2b9c7a7f1c")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(404);
    expect(response.body).to.eql({
      error: "Not Found",
      message: "Temoignage inconnu",
      statusCode: 404,
    });
  });
});
