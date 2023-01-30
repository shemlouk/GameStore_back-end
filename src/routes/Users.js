import { cadastro, login, updateImg } from "../controllers/usersController.js";
import authentication from "../middlewares/authentication.js";
import { Router } from "express";
import { logout } from "../controllers/usersController.js";

const route = Router();

route.post(`/sign-up`, cadastro);
route.post(`/login`, login);
route.post(`/update-img`, authentication, updateImg);
route.delete(`/logout`, logout);

export default route;
