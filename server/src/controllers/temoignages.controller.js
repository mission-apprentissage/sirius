const temoignagesService = require("../services/temoignages.service");
const { BasicError } = require("../errors");
const tryCatch = require("../utils/tryCatch.utils");

const createTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

const getTemoignages = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.getTemoignages();

  if (!success) throw new BasicError();

  return res.status(200).json(body);
});

module.exports = { createTemoignage, getTemoignages };
