const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");

const httpTests = require("../utils/httpTests");

const { createVerifyAndLoginUser } = require("../utils/user");
const { USER_STATUS } = require("../../../src/constants");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and the current user", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const meRequest = await httpClient
      .get("/api/users/me")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send();

    expect(meRequest.status).to.equal(200);
    expect(meRequest.body).to.deep.includes({
      ...loggedInUserResponse.user,
      etablissements: loggedInUserResponse.etablissements,
      emailConfirmed: true,
      status: USER_STATUS.ACTIVE,
    });
  });
  it("should return 401 and unauthorized error if no bearer token is provided", async () => {
    const { httpClient } = await startServer();

    const meRequest = await httpClient.get("/api/users/me").set("Authorization", `Bearer`).send();
    expect(meRequest.status).to.equal(401);
  });
});
