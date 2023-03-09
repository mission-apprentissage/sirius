const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");

const httpTests = require("../utils/httpTests");
const { newUser } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and the current user", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    await createUser(user.username, user.password, user.firstName, user.lastName);

    const loggedInUser = await httpClient
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });

    const meRequest = await httpClient
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loggedInUser.body.token}`)
      .send();

    expect(meRequest.status).to.equal(200);
    expect(meRequest.body).to.deep.equal({
      authStrategy: user.authStrategy,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
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
