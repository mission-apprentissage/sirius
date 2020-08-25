const runScript = require("../../core/runScript");
const fixCreationDate = require("./fixCreationDate");

runScript(async ({ db }) => {
  await fixCreationDate(db);
});
