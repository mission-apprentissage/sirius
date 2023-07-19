const formationsService = require("../services/formations.service");
const { BasicError, FormationNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createFormation = tryCatch(async (req, res) => {
  const { success, body } = await formationsService.createFormation(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getFormations = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body } = await formationsService.getFormations(query);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getFormation = tryCatch(async (req, res) => {
  const id = req.params.id;
  const { success, body } = await formationsService.getFormation(id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteFormation = tryCatch(async (req, res) => {
  const { success, body } = await formationsService.deleteFormation(req.params.id);

  if (!success) throw new BasicError();
  if (!body.deletedCount) throw new FormationNotFoundError();

  return res.status(200).json(body);
});

const updateFormation = tryCatch(async (req, res) => {
  const { success, body } = await formationsService.updateFormation(req.params.id, req.body);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new FormationNotFoundError();

  return res.status(200).json(body);
});

module.exports = { createFormation, getFormations, getFormation, deleteFormation, updateFormation };
