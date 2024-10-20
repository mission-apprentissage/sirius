import { USER_ROLES, USER_STATUS } from "../../../src/constants";
import * as usersDao from "../../../src/dao/users.dao";
import { createUser } from "../../../src/services/users.service";
import { newEtablissement, newUser } from "../../fixtures";

export const createVerifyAndLoginUser = async (httpClient: any, isAdmin = false) => {
  const user = newUser({ password: "toto" });
  const etablissement = newEtablissement({ siret: "12345678901234" });

  const { body: createdUser } = await createUser({
    email: user.email,
    // @ts-expect-error
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    comment: user.comment,
    // [etablissement]
  });

  await usersDao.update(createdUser.id, {
    email_confirmed: true,
    status: USER_STATUS.ACTIVE,
    role: isAdmin ? USER_ROLES.ADMIN : USER_ROLES.ETABLISSEMENT,
  });

  const loggedInUser = await httpClient
    .post("/api/users/login")
    // @ts-expect-error
    .send({ email: user.email.toLowerCase(), password: user.password });

  return {
    user: loggedInUser.body.user,
    etablissements: [etablissement],
    token: loggedInUser.body.token,
    headers: loggedInUser.headers,
  };
};
