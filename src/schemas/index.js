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

export const userSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().min(1).email().required(),
  password: Joi.string().min(3).required(),
  img: Joi.string(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
