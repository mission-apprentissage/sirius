const verbatimsService = require("../services/verbatims.service");
const { BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const getVerbatims = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body, pagination } = await verbatimsService.getVerbatims(query);

  if (!success) throw new BasicError();

  return res.status(200).json({ body, pagination });
});

const patchVerbatim = tryCatch(async (req, res) => {
  const { success, body } = await verbatimsService.patchVerbatim(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const patchMultiVerbatim = tryCatch(async (req, res) => {
  const { success, body } = await verbatimsService.patchMultiVerbatim(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = { getVerbatims, patchVerbatim, patchMultiVerbatim };
