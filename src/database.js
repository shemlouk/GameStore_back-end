import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
const db = mongoClient.db();

try {
  db.command({ ping: 1 });
  console.log("Connected with database");
} catch (err) {
  throw err;
}

export const [SESSIONS, USERS, CARTS, PURCHASES, PRODUCTS] = [
  "sessions",
  "users",
  "carts",
  "purchases",
  "products",
].map((c) => db.collection(c));
