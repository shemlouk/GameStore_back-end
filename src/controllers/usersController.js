import { USERS, CARTS, PURCHASES, SESSIONS } from "../database.js";
import { userSchema, loginSchema } from "../schemas/index.js";
import { v4 as uuid } from "uuid";
import bcrypt from "bcrypt";
import dayjs from "dayjs";

export const cadastro = async (req, res) => {
  let img = "";
  if (req.body?.img) {
    img = req.body?.img;
  }

  // inicio validação Joi
  console.log(req.body);
  const user = req.body;
  const validation = userSchema.validate(user);
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

  const validation = loginSchema.validate(login);
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
      // const accountObject = await USERS.findOne({ user_id: userDb._id });
      const loggedToken = await SESSIONS.findOne({ user_id: userDb._id });

      if (loggedToken) await SESSIONS.deleteOne({ user_id: userDb._id });

      const userObject = {
        token: token,
        name: userDb.name,
        email: userDb.email,
        image: userDb.img,
        // saldo: accountObject.saldo,
      };
      await SESSIONS.insertOne({
        user_id: userDb._id,
        token: token,
        updated_at: dayjs().format("DD/MM"),
      });
      return res.status(200).send(userObject);
    }
    return res.sendStatus(404);
  } else {
    res.sendStatus(404);
  }
};

export const updateImg = async (req, res) => {
  const { userId } = res.locals;
  try {
    await USERS.updateOne({ _id: userId }, { $set: { img: req.body?.img } });
    res.status(200).send(req.body?.img);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const logout = async (req, res) => {
  const { authorization } = req.headers;

  const token = authorization?.replace("Bearer ", "");

  if (!token) return res.sendStatus(401);

  try {
    await SESSIONS.deleteOne({ token });
    res.sendStatus(200);
  } catch (error) {
    res.status(500).send(error.message);
  }
}
