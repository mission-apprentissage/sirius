// eslint-disable-next-line node/no-unpublished-import
import type { SuperTest, Test } from "supertest";

import { USER_ROLES, USER_STATUS } from "../../../src/constants";
import * as usersDao from "../../../src/dao/users.dao";
import { createUser } from "../../../src/services/users.service";
import { newEtablissement, newUser } from "../../fixtures";

export const createVerifyAndLoginUser = async (httpClient: SuperTest<Test>, isAdmin = false) => {
  const user = newUser();
  const etablissement = newEtablissement({ siret: "12345678901234" });

  const { body: createdUser } = await createUser({
    email: user.email,
    password: user.password,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    comment: user.comment,
    confirmationToken: user.confirmationToken,
  });

  await usersDao.update(createdUser.id, {
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
