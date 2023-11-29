const { expect } = require("chai");
const httpTests = require("../utils/httpTests");
const { newCampagne, newEtablissement, newFormation } = require("../../fixtures");
const { createVerifyAndLoginUser } = require("../utils/user");

httpTests(__filename, ({ startServer }) => {
  it("should return 200 and delete the campagne if it exists", async () => {
    const { httpClient, components } = await startServer();

    const campagne1 = newCampagne();
    const campagne2 = newCampagne();

    const createdCampagne1 = await components.campagnes.create(campagne1);
    const createdCampagne2 = await components.campagnes.create(campagne2);

    const formation1 = newFormation({ campagneId: createdCampagne1._id.toString() });
    const formation2 = newFormation({ campagneId: createdCampagne2._id.toString() });

    const createdFormation1 = await components.formations.create(formation1);
    const createdFormation2 = await components.formations.create(formation2);

    const etablissement = newEtablissement({
      data: { siret: "12345678901234" },
      formationIds: [createdFormation1._id.toString(), createdFormation2._id.toString()],
    });

    await components.etablissements.create(etablissement);

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes?ids=" + [createdCampagne1._id, createdCampagne2._id].join(","))
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(200);
    expect(response.body).to.deep.includes({
      acknowledged: true,
      matchedCount: 2,
      modifiedCount: 2,
      upsertedCount: 0,
      upsertedId: null,
    });
  });
  it("should return 401 if campagne does not exist as the user can not access it", async () => {
    const { httpClient } = await startServer();

    const loggedInUserResponse = await createVerifyAndLoginUser(httpClient);

    const response = await httpClient
      .delete("/api/campagnes?ids=5f7b5c5d0f7e0e2b9c7a7f1c")
      .set("Authorization", `Bearer ${loggedInUserResponse.token}`);

    expect(response.status).to.eql(401);
    expect(response.body).to.deep.includes({ error: "Unauthorized", message: "Unauthorized", statusCode: 401 });
  });
});
