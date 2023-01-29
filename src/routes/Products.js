import { create, read } from "../controllers/productsController.js";
import { Router } from "express";

const route = Router();

route.post("/products", create);
route.get("/products", read);

export default route;
