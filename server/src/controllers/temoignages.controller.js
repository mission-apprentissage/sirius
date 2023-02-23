const temoignagesService = require("../services/temoignages.service");
const { BasicError } = require("../core/errors");
const tryCatch = require("../core/http/tryCatchMiddleware");

const createTemoignage = tryCatch(async (req, res) => {
  const { success, body } = await temoignagesService.createTemoignage(req.body);

  if (!success) throw new BasicError();

  return res.status(201).json(body);
});

module.exports = { createTemoignage };
