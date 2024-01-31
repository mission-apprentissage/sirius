const Joi = require("joi");

const patchVerbatim = Joi.object({
  payload: Joi.object({
    content: Joi.string().allow(""),
    status: Joi.string(),
  }).required(),
  questionId: Joi.string().required(),
  temoignageId: Joi.string().required(),
});

const patchMultiVerbatims = Joi.array().items(patchVerbatim).required().min(1);

module.exports = {
  patchVerbatim,
  patchMultiVerbatims,
};
