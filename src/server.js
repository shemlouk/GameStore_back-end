import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Products from "./routes/Products.js";
import Users from "./routes/Users.js";
import Cart from "./routes/Cart.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(Products);
app.use(Users);
app.use(Cart);

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
