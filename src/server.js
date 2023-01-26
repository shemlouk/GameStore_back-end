import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { cadastro, login, updateImg } from "./routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.post(`${process.env.MONGO_URI}/sign-up`, cadastro)
app.post(`${process.env.MONGO_URI}/login`, login)
app.post(`${process.env.MONGO_URI}/update-img`, updateImg)

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
