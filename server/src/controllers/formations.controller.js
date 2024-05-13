const formationsService = require("../services/formations.service");
const { BasicError, FormationNotFoundError, FormationAlreadyExistingError, ErrorMessage } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createFormation = tryCatch(async (req, res) => {
  const { success, body } = await formationsService.createFormation(req.body);

  if (!success && body.message === ErrorMessage.FormationAlreadyExistingError)
    throw new FormationAlreadyExistingError();
  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getFormations = tryCatch(async (req, res) => {
  const search = req.query.search;
  const formationIds = req.query.formationIds.split(",");

  const { success, body } = await formationsService.getFormations({ search, formationIds });

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

const alreadyExistingFormations = tryCatch(async (req, res) => {
  const { success, body } = await formationsService.alreadyExistingFormations(req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  createFormation,
  getFormations,
  getFormation,
  deleteFormation,
  updateFormation,
  alreadyExistingFormations,
};
