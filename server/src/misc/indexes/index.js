// eslint-disable-next-line node/no-unpublished-require
const faker = require("faker");
const _ = require("lodash");
const runScript = require("../../core/runScript");
const createIndexes = require("./createIndexes");
const dropIndexes = require("./dropIndexes");
const capLogs = require("./capLogs");

faker.locale = "fr";

runScript(async ({ db }) => {
  await dropIndexes(db);
  await createIndexes(db);
  await capLogs(db);
});
