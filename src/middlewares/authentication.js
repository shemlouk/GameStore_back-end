import { SESSIONS } from "../database.js";

const authentication = async (req, res, next) => {
  const token = req.get("authorization")?.replace(/(Bearer )/g, "");
  if (!token) return res.sendStatus(401);
  try {
    const { user_id } = await SESSIONS.findOne({ token });
    if (!user_id) res.sendStatus(401);
    res.locals.userId = user_id;
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

export default authentication;
