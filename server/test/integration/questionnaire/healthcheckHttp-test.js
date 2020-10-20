const assert = require("assert");
const httpTests = require("../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut obtenir l'état de santé de l'application", async () => {
    let { httpClient } = await startServer();

    let response = await httpClient.get("/api/healthcheck");

    assert.strictEqual(response.status, 200);
    assert.deepStrictEqual(response.data, {
      env: "standalone",
      healthcheck: true,
      version: "1.0.0",
    });
  });
});
