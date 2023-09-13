const { use, expect } = require("chai");
const sinonChai = require("sinon-chai");
const httpTests = require("../utils/httpTests");
const { newUser } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");

use(sinonChai);

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and the user token", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    await createUser(user.email, user.password, user.firstName, user.lastName);

    const login = {
      email: user.email.toLowerCase(),
      password: user.password,
    };
    const response = await httpClient.post("/api/users/login").send(login);

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      success: true,
      token: response.body.token,
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();

    const user = newUser({ password: "toto" });
    const login = {
      email: user.email.toLowerCase(),
    };
    const response = await httpClient.post("/api/users/login").send(login);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({
      details: [
        {
          context: {
            key: "password",
            label: "password",
          },
          message: '"password" is required',
          path: ["password"],
          type: "any.required",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
