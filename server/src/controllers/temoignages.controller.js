const temoignagesService = require("../services/temoignages.service");
const { BasicError, TemoignageNotFoundError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getTemoignages = tryCatch(async (req, res) => {
  const query = req.query;
  const { success, body } = await temoignagesService.getTemoignages(query);

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

const deleteTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.deleteTemoignage(req.params.id);

  if (!success) throw new BasicError();
  if (!body.deletedCount) throw new TemoignageNotFoundError();

  return res.status(200).json(body);
});

module.exports = { createTemoignage, getTemoignages, deleteTemoignage };
