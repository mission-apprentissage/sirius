// eslint-disable-next-line node/no-unpublished-import
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import * as usersDao from "../../../src/dao/users.dao";
import { createUser } from "../../../src/services/users.service";
import { newUser } from "../../fixtures";
import { usePg } from "../utils/pg.test.utils";
import { startServer } from "../utils/testUtils";

usePg();

describe("Login routes", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let app: any;

  beforeAll(async () => {
    app = await startServer();

    return () => true;
  }, 15_000);

  beforeEach(async () => {
    //
  });

  it("should return 200 and the user token", async () => {
    const user = newUser();
    const { body: createdUser } = await createUser({
      email: user.email,
      confirmationToken: user.confirmationToken,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      comment: user.comment,
    });

    await usersDao.update(createdUser._id, {
      emailConfirmed: true,
    });
    const login = {
      email: user.email.toLowerCase(),
      password: user.password,
    };
    const response = await app.post("/api/users/login").send(login);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      success: true,
      token: response.body.token,
    });
  });

  it("should return 400 and a validation error if the payload is not correct", async () => {
    const user = newUser({ password: "toto" });

    const login = {
      email: user.email.toLowerCase(),
    };
    const response = await app.post("/api/users/login").send(login);

    expect(response.status).to.equal(400);
    expect(response.body).to.deep.equal({});
  });
});
