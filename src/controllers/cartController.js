import { CARTS } from "../database.js";

export const add = async (req, res) => {
  const { id } = req.body;
  const userId = res.locals.userId;
  try {
    const duplicate = await CARTS.findOne({
      $and: [{ userId }, { products: { $in: [id] } }],
    });
    if (duplicate) return res.sendStatus(409);
    CARTS.updateOne({ userId }, { $push: { products: id } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const remove = async (req, res) => {
  const { id } = req.body;
  try {
    CARTS.updateOne({ userId: res.locals.userId }, { $pull: { products: id } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const empty = async (req, res) => {
  try {
    CARTS.updateOne({ userId: res.locals.userId }, { $set: { products: [] } });
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const read = async (req, res) => {
  try {
    const { products } = await CARTS.findOne({ userId: res.locals.userId });
    res.send(products);
  } catch (err) {
    res.status(500).json(err);
  }
};
