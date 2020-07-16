const assert = require("assert");
const httpTests = require("../utils/httpTests");

httpTests(__filename, ({ startServer }) => {
  it("Vérifie qu'on peut obtenir un email", async () => {
    let { httpClient } = await startServer();

    let response = await httpClient.get("/api/emails/finAnnee");

    assert.strictEqual(response.status, 200);
    let html = response.data;
    assert.ok(html.indexOf("Bonjour") !== -1);
  });
});
