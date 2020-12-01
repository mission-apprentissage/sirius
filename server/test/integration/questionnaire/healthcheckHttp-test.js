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

  it("Vérifie qu'on peut obtenir une erreur de test", async () => {
    let { httpClient } = await startServer();

    let response = await httpClient.get("/api/healthcheck/error");

    assert.strictEqual(response.status, 500);
    assert.deepStrictEqual(response.data, {
      error: "Internal Server Error",
      message: "Une erreur est survenue",
      statusCode: 500,
    });
  });
});
