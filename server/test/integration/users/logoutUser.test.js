const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");

const httpTests = require("../utils/httpTests");
const { newUser } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete refreshToken cookie", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    await createUser(user.username, user.password, user.firstName, user.lastName);

    const loggedInUser = await httpClient
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });

    const logoutRequest = await httpClient
      .get("/api/users/logout")
      .set("Authorization", `Bearer ${loggedInUser.body.token}`)
      .set("Cookie", [...loggedInUser.headers["set-cookie"]])
      .send();

    expect(logoutRequest.user).to.be.undefined;
    expect(logoutRequest.status).to.equal(200);
    expect(logoutRequest.body).to.deep.equal({
      success: true,
    });
  });
  it("should return 401 and unauthorized error if no bearer token is provided", async () => {
    const { httpClient } = await startServer();

    const logoutRequest = await httpClient.get("/api/users/logout").set("Authorization", `Bearer`).send();
    expect(logoutRequest.status).to.equal(401);
  });
  it("should return 401 and unauthorized error if no signed cookie is provided", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    await createUser(user.username, user.password, user.firstName, user.lastName);

    const loggedInUser = await httpClient
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });

    const logoutRequest = await httpClient
      .get("/api/users/logout")
      .set("Authorization", `Bearer ${loggedInUser.body.token}`)
      .send();

    expect(logoutRequest.status).to.equal(401);
  });
});
