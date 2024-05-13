const verbatimsService = require("../services/verbatims.service");
const { BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const getVerbatims = tryCatch(async (req, res) => {
  const query = req.query;

  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;
  const questionKey = query.question || null;
  const status = query.selectedStatus || null;
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 100;

  const { success, body, pagination } = await verbatimsService.getVerbatims({
    etablissementSiret,
    formationId,
    status,
    page,
    pageSize,
    questionKey,
  });

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
