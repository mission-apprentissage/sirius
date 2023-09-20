const verbatimsService = require("../services/verbatims.service");
const { BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const getVerbatims = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body } = await verbatimsService.getVerbatims(query);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = { getVerbatims };
