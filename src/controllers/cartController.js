import { CARTS, PRODUCTS } from "../database.js";
import { ObjectId } from "mongodb";

export const add = async (req, res) => {
  const { id } = req.body;
  const userId = res.locals.userId;
  try {
    const { price } = await PRODUCTS.findOne({ _id: ObjectId(id) });
    if (!price) return res.sendStiatus(422);
    const duplicate = await CARTS.findOne({
      $and: [{ userId }, { products: { $in: [id] } }],
    });
    if (duplicate) return res.sendStatus(409);
    await CARTS.updateOne(
      { userId },
      { $push: { products: id }, $inc: { total: price } }
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const remove = async (req, res) => {
  const { id } = req.body;
  try {
    const { price } = await PRODUCTS.findOne({ _id: ObjectId(id) });
    if (!price) return res.sendStiatus(422);
    CARTS.updateOne(
      { userId: res.locals.userId },
      { $pull: { products: id }, $inc: { total: -price } }
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const empty = async (req, res) => {
  try {
    CARTS.updateOne(
      { userId: res.locals.userId },
      { $set: { products: [], total: 0 } }
    );
    res.sendStatus(200);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const read = async (req, res) => {
  try {
    const { products, total } = await CARTS.findOne({
      userId: res.locals.userId,
    });
    res.send({ products, total });
  } catch (err) {
    res.status(500).json(err);
  }
};
