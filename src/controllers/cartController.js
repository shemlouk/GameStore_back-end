import { CARTS } from "../database.js";

export const add = async (req, res) => {
  const { id } = req.body;
  try {
    CARTS.updateOne({ userId: res.locals.userId }, { $push: { products: id } });
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
