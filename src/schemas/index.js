import Joi from "joi";

export const productSchema = Joi.object({
  name: Joi.string(),
  about: Joi.string(),
  image: Joi.string().uri(),
  price: Joi.number().positive(),
  score: Joi.number().min(0).max(5).positive().integer(),
  plataforms: Joi.array().items(Joi.string().valid("mac", "windows", "linux")),
})
  .options({ presence: "required" })
  .required();
