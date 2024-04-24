const { newUser, newEtablissement } = require("../../fixtures");
const createUser = require("../../../src/db/createUser");
const usersDao = require("../../../src/dao/users.dao");
const { USER_STATUS, USER_ROLES } = require("../../../src/constants");

const createVerifyAndLoginUser = async (httpClient, isAdmin = false) => {
  const user = newUser({ password: "toto" });
  const etablissement = newEtablissement({ siret: "12345678901234" });

  const createdUser = await createUser(
    user.email,
    user.password,
    user.firstName,
    user.lastName,
    user.role,
    user.comment,
    [etablissement]
  );

  await usersDao.update(createdUser._id, {
    ...createdUser.toObject(),
    emailConfirmed: true,
    status: USER_STATUS.ACTIVE,
    role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.ETABLISSEMENT,
  });

  const loggedInUser = await httpClient
    .post("/api/users/login")
    .send({ email: user.email.toLowerCase(), password: user.password });

  return {
    user: loggedInUser.body.user,
    etablissements: [etablissement],
    token: loggedInUser.body.token,
    headers: loggedInUser.headers,
  };
};

module.exports = {
  createVerifyAndLoginUser,
};
