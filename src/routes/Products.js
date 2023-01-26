import { create } from "../controllers/productsController.js";
import { Router } from "express";

const route = Router();

route.post("/products", create);

export default route;
