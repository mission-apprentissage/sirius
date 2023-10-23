const campagnesService = require("../services/campagnes.service");
const { BasicError, CampagneNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const getCampagnes = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getCampagnes(req.query);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getCampagne = tryCatch(async (req, res) => {
  const query = { id: req.params.id };
  const { success, body } = await campagnesService.getOneCampagne(query);

  if (!success) throw new BasicError();
  if (!body) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const createCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.createCampagne(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const deleteCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.deleteCampagne(req.params.id);

  if (!success) throw new BasicError();
  if (body.modifiedCount === 0) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

const updateCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.updateCampagne(req.params.id, req.body);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const createMultiCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.createMultiCampagne(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getExport = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getExport(req.params.id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getMultipleExport = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const user = {
    label: req.user.firstName + " " + req.user.lastName,
    email: req.user.email,
  };

  const { success, body } = await campagnesService.getMultipleExport(ids, user);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  getCampagnes,
  getCampagne,
  createCampagne,
  deleteCampagne,
  updateCampagne,
  createMultiCampagne,
  getExport,
  getMultipleExport,
};
