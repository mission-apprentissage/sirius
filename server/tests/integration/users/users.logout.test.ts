// eslint-disable-next-line node/no-unpublished-import
import { beforeAll, beforeEach, describe, expect, it } from "vitest";

import { usePg } from "../utils/pg.test.utils";
import { startServer } from "../utils/testUtils";
import { createVerifyAndLoginUser } from "../utils/user";

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

  it("should return 200 and delete refreshToken cookie", async () => {
    const loggedInUserResponse = await createVerifyAndLoginUser(app);

    const logoutRequest = await app
      .get("/api/users/logout")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .set("Cookie", [...loggedInUserResponse.headers["set-cookie"]])
      .send();

    expect(logoutRequest.user).to.be.undefined;
    expect(logoutRequest.status).to.equal(200);
    expect(logoutRequest.body).to.deep.equal({
      success: true,
    });
  });
});
