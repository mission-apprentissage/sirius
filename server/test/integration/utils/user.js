const { newUser } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");

const createAndLoginUser = async (httpClient) => {
  const user = newUser({ password: "toto" });
  await createUser(user.username, user.password, user.firstName, user.lastName);

  const loggedInUser = await httpClient
    .post("/api/users/login")
    .send({ username: user.username.toLowerCase(), password: user.password });

  return { user, token: loggedInUser.body.token, headers: loggedInUser.headers };
};

module.exports = {
  createAndLoginUser,
};
