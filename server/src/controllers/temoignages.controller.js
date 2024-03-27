const temoignagesService = require("../services/temoignages.service");
const {
  BasicError,
  TemoignageNotFoundError,
  CampagneNotStarted,
  CampagneEnded,
  NoSeatsAvailable,
  ErrorMessage,
} = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getTemoignages = tryCatch(async (req, res) => {
  const { campagneId } = req.query;
  const { success, body } = await temoignagesService.getTemoignages([campagneId]);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getBigTemoignages = tryCatch(async (req, res) => {
  const campagneIds = req.body;
  const { success, body } = await temoignagesService.getTemoignages(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.deleteTemoignage(req.params.id);

  if (!success) throw new BasicError();
  if (!body.modifiedCount) throw new TemoignageNotFoundError();

  return res.status(200).json(body);
});

const updateTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.updateTemoignage(req.params.id, req.body);

  if (!success && body === ErrorMessage.CampagneNotStarted) throw new CampagneNotStarted();
  if (!success && body === ErrorMessage.CampagneEnded) throw new CampagneEnded();
  if (!success && body === ErrorMessage.NoSeatsAvailable) throw new NoSeatsAvailable();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const getDatavisualisation = tryCatch(async (req, res) => {
  const campagneIds = req.body;
  const { success, body } = await temoignagesService.getDatavisualisation(campagneIds);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = {
  createTemoignage,
  getTemoignages,
  deleteTemoignage,
  updateTemoignage,
  getBigTemoignages,
  getDatavisualisation,
};
