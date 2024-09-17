const Joi = require("joi");
const { VERBATIM_STATUS } = require("../constants");

const patchVerbatim = Joi.object({
  id: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(VERBATIM_STATUS))
    .required(),
});

const patchMultiVerbatims = Joi.array().items(patchVerbatim).required().min(1);

module.exports = {
  patchVerbatim,
  patchMultiVerbatims,
};
