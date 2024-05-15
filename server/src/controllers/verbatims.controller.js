const verbatimsService = require("../services/verbatims.service");
const { BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const getVerbatims = tryCatch(async (req, res) => {
  const query = req.query;

  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;
  const status = query.selectedStatus || null;
  const onlyDiscrepancies = query.showOnlyDiscrepancies || false;
  const page = parseInt(query.page) || 1;
  const pageSize = parseInt(query.pageSize) || 100;

  const { success, body, pagination } = await verbatimsService.getVerbatims({
    etablissementSiret,
    formationId,
    status,
    onlyDiscrepancies,
    page,
    pageSize,
  });

  if (!success) throw new BasicError();

  return res.status(200).json({ body, pagination });
});

const getVerbatimsCount = tryCatch(async (req, res) => {
  const query = req.query;

  const etablissementSiret = query.etablissementSiret || null;
  const formationId = query.formationId || null;

  const { success, body } = await verbatimsService.getVerbatimsCount({
    etablissementSiret,
    formationId,
  });

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const patchVerbatims = tryCatch(async (req, res) => {
  const { success, body } = await verbatimsService.patchVerbatims(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const createVerbatim = tryCatch(async (req, res) => {
  const { success, body } = await verbatimsService.createVerbatim(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

module.exports = { getVerbatims, patchVerbatims, getVerbatimsCount, createVerbatim };
