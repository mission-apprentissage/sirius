const campagnesService = require("../services/campagnes.service");
const { BasicError, CampagneNotFoundError } = require("../core/errors");
const tryCatch = require("../core/http/tryCatchMiddleware");

const getCampagnes = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getCampagnes();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getCampagne = tryCatch(async (req, res) => {
  const { success, body } = await campagnesService.getOneCampagne(req.params.id);

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
  if (!body.deletedCount) throw new CampagneNotFoundError();

  return res.status(200).json(body);
});

module.exports = { getCampagnes, getCampagne, createCampagne, deleteCampagne };
