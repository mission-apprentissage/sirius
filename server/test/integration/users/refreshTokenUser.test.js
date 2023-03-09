const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");

const httpTests = require("../utils/httpTests");
const { newUser } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and the new user token", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    await createUser(user.username, user.password, user.firstName, user.lastName);

    const loggedInUser = await httpClient
      .post("/api/users/login")
      .send({ username: user.username, password: user.password });

    const refreshTokenRequest = await httpClient
      .post("/api/users/refreshToken")
      .set("Cookie", [...loggedInUser.headers["set-cookie"]])
      .send();

    expect(refreshTokenRequest.headers["set-cookie"]).to.eql([...loggedInUser.headers["set-cookie"]]);
    expect(refreshTokenRequest.status).to.equal(200);
    expect(refreshTokenRequest.body).to.deep.equal({
      success: true,
      token: refreshTokenRequest.body.token,
    });
  });
  it("should return 401 and unauthorized error if no signed cookies is provided", async () => {
    const { httpClient } = await startServer();

    const refreshTokenRequest = await httpClient.post("/api/users/refreshToken").send();
    expect(refreshTokenRequest.status).to.equal(401);
  });
});
