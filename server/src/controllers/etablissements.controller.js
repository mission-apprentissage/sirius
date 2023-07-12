const etablissementsService = require("../services/etablissements.service");
const { BasicError, EtablissementNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.createEtablissement(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getEtablissements = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body } = await etablissementsService.getEtablissements(query);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getEtablissement = tryCatch(async (req, res) => {
  const id = req.params.id;
  const { success, body } = await etablissementsService.getEtablissement(id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.deleteEtablissement(req.params.id);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

const updateEtablissement = tryCatch(async (req, res) => {
  const { success, body } = await etablissementsService.updateEtablissement(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new EtablissementNotFoundError();

  return res.status(200).json(body);
});

module.exports = { createEtablissement, getEtablissements, getEtablissement, deleteEtablissement, updateEtablissement };
