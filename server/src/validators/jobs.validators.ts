import Joi from "joi";

import { JOB_TYPES } from "../constants";

export const startJobSchema = Joi.object({
  jobType: Joi.string()
    .valid(...Object.values(JOB_TYPES))
    .required(),
  onlyAnonymized: Joi.boolean(),
  forceGem: Joi.boolean(),
  notCorrectedAndNotAnonymized: Joi.boolean(),
});
