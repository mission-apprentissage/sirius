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

const deleteCampagnes = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const { success, body } = await campagnesService.deleteCampagnes(ids);

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

const getPdfExport = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getPdfExport(req.params.id);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getPdfMultipleExport = tryCatch(async (req, res) => {
  const ids = req.query.ids.split(",");
  const user = {
    label: req.user.firstName + " " + req.user.lastName,
    email: req.user.email,
  };

  const { success, body } = await campagnesService.getPdfMultipleExport(ids, user);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  getCampagnes,
  getCampagne,
  createCampagne,
  deleteCampagnes,
  updateCampagne,
  createMultiCampagne,
  getPdfExport,
  getPdfMultipleExport,
};
