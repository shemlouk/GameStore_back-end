import { create, read } from "../controllers/productsController.js";
import authentication from "../middlewares/authentication.js";
import { Router } from "express";

const route = Router();

route.post("/products", create);
route.get("/products", authentication, read);

export default route;
