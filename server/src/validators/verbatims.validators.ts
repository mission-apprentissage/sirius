import Joi from "joi";

import { VERBATIM_STATUS } from "../constants";

export const patchVerbatim = Joi.object({
  id: Joi.string().required(),
  status: Joi.string()
    .valid(...Object.values(VERBATIM_STATUS))
    .required(),
});

export const patchMultiVerbatims = Joi.array().items(patchVerbatim).required().min(1);
