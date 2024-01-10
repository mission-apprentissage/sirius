const Joi = require("joi");

const patchMultiVerbatims = Joi.array()
  .items({
    temoignageId: Joi.string().required(),
    questionId: Joi.string().required(),
    payload: Joi.object({
      status: Joi.string().required(),
      content: Joi.string().allow(""),
    }),
  })
  .required();

module.exports = { patchMultiVerbatims };
