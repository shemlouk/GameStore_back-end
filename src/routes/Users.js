import { cadastro, login, updateImg } from "../controllers/usersController.js";
import authentication from "../middlewares/authentication.js";
import { Router } from "express";

const route = Router();

route.post(`/sign-up`, cadastro);
route.post(`/login`, login);
route.post(`/update-img`, authentication, updateImg);

export default route;
