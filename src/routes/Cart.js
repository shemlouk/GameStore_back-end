import { add, remove, empty, read } from "../controllers/cartController.js";
import authentication from "../middlewares/authentication.js";
import { Router } from "express";

const route = Router();

route.use(authentication);

route.put("/cart", add);
route.get("/cart", read);
route.patch("/cart", empty);
route.delete("/cart", remove);

export default route;
