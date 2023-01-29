import Joi from "joi";
import bcrypt from "bcrypt";
import { USERS, CARTS, PURCHASES, SESSIONS } from "./database.js";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";

const authenticationToken = (req, res, next) => {
  const token = req.headers?.authorization;
  const tokenT = token.replace("Bearer", "");

  const tokenFind = SESSIONS.findOne({ token: tokenT });
};

export const cadastro = async (req, res) => {
  let img = "";
  if (req.body?.img) {
    img = req.body?.img;
  }

  // inicio validação Joi
  console.log(req.body);
  const user = req.body;
  const userJoi = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().min(1).email().required(),
    password: Joi.string().min(3).required(),
    img: Joi.string().uri(),

  });
  const validation = userJoi.validate(user);
  if (validation.error) {
    return res.status(422).send("Verifique os dados e tente novamente!");
  }
  // fim validação Joi

  // inicio validação usuario existe
  const usuarioExiste = await USERS.findOne({
    email: req.body?.email.toLowerCase(),
  });

  if (usuarioExiste) {
    return res.status(409).send("usuario já registrado!");
  }
  // fim validação usuario existe

  const hashPass = await bcrypt.hash(req.body?.password, 8);

  const userC = await USERS.insertOne({
    name: req.body?.name,
    email: req.body?.email.toLowerCase(),
    password: hashPass,
    img: img,
    createdtime: dayjs().format("DD:MM:YYYY HH:mm:ss"),
    edittime: dayjs().format("DD:MM:YYYY HH:mm:ss"),
  });
  await CARTS.insertOne({
    userId: userC.insertedId,
    products: [],
    total: 0.0,
    type: false,
  });
  await PURCHASES.insertOne({
    user_id: userC.insertedId,
    createdtime: dayjs().format("DD:MM:YYYY HH:mm:ss"),
  });

  return res.sendStatus(201);
};

export const login = async (req, res) => {
  const token = uuid();
  const login = req.body;
  const loginJoy = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const validation = loginJoy.validate(login);
  if (validation.error) {
    console.log("error");
    return res.status(422).send("verifique os dados e tente novamente!");
  }
  const userDb = await USERS.findOne({ email: login.email });
  if (userDb) {
    const comparation = await bcrypt.compare(
      req.body.password,
      userDb.password
    );
    if (userDb && comparation) {
      const accountObject = await USERS.findOne({ user_id: userDb._id });
      const loggedToken = await SESSIONS.findOne({ user_id: userDb._id });

      if (loggedToken) await SESSIONS.deleteOne({ user_id: userDb._id });

      const userObject = {
        token: token,
        name: userDb.name,
        email: userDb.email,
      };
      await SESSIONS.insertOne({
        user_id: userDb._id,
        token: token,
        createdtime: dayjs().format("DD/MM"),
      });
      return res.status(200).send(userObject);
    }
    return res.sendStatus(404);
  } else {
    res.sendStatus(404);
  }
};

export const updateImg = async (req, res) => {
  const token = req.headers?.authorization;
  const tokenT = token.replace("Bearer", "");

  const tokenFind = await SESSIONS.findOne({ token: tokenT });

  if (tokenFind) {
    await USERS.updateOne({ _id: tokenFind.user_id }, { img: req.body?.img });
    res.sendStatus(200);
  }
  return res.status(404).send("Token não encontrado!");
};

export const logout = async (req, res) => {};
