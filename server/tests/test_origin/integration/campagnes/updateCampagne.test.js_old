const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newCampagne } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should returns 200 and update the campagne", async () => {
    const { httpClient } = await startServer();
    const campagne = newCampagne();
    const newCampagneName = "updatedCampagne";

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const existingCampagne = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    const campagneWithNewName = newCampagne({ ...campagne, nomCampagne: newCampagneName });

    const updatedCampagne = await httpClient
      .put(`/api/campagnes/${existingCampagne.body._id}`)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagneWithNewName);

    expect(updatedCampagne.status).to.eql(200);
    expect(updatedCampagne.body).to.eql({
      acknowledged: true,
      matchedCount: 1,
      modifiedCount: 1,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 400 and a validation error if the payload is not correct", async () => {
    const { httpClient } = await startServer();
    const newCampagneName = "";
    const campagne = newCampagne();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const existingCampagne = await httpClient
      .post("/api/campagnes/")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagne);

    const campagneWithNewName = { nomCampagne: newCampagneName };

    const updatedCampagne = await httpClient
      .put(`/api/campagnes/${existingCampagne.body._id}`)
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`)
      .send(campagneWithNewName);

    expect(updatedCampagne.status).to.eql(400);
    expect(updatedCampagne.body).to.eql({
      details: [
        {
          context: {
            key: "startDate",
            label: "startDate",
          },
          message: '"startDate" is required',
          path: ["startDate"],
          type: "any.required",
        },
      ],
      error: "Bad Request",
      message: "Erreur de validation",
      statusCode: 400,
    });
  });
});
