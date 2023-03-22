const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");

const httpTests = require("../utils/httpTests");

const { createAndLoginUser } = require("../utils/user");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and the current user", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createAndLoginUser(httpClient);

    const meRequest = await httpClient
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send();

    expect(meRequest.status).to.equal(200);
    expect(meRequest.body).to.deep.equal({
      authStrategy: loggedInUserResponse.user.authStrategy,
      firstName: loggedInUserResponse.user.firstName,
      lastName: loggedInUserResponse.user.lastName,
      username: loggedInUserResponse.user.username.toLowerCase(),
      _id: meRequest.body._id,
      __v: 0,
    });
  });
  it("should return 401 and unauthorized error if no bearer token is provided", async () => {
    const { httpClient } = await startServer();

    const meRequest = await httpClient.get("/api/users/me").set("Authorization", `Bearer`).send();
    expect(meRequest.status).to.equal(401);
  });
});
