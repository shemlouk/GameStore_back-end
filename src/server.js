import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Products from "./routes/Products.js";
import * as R from "./routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(Products);

app.post(`/sign-up`, R.cadastro)
app.post(`/login`, R.login)
app.post(`/update-img`, R.updateImg)
app.post(`/products`)

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
