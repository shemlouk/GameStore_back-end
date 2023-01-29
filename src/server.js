import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Products from "./routes/Products.js";
import { cadastro, login, updateImg } from "./routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(Products);

app.post(`/sign-up`, cadastro)
app.post(`/login`, login)
app.post(`/update-img`, updateImg)

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
