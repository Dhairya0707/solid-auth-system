import express from "express";
import loginController from "../modules/auth/login.controller.js";
import registerController from "../modules/auth/register.controller.js";
import refreshController from "../modules/auth/refresh.controller.js";

const AuthRouter = express.Router();

AuthRouter.post("/register", registerController);

AuthRouter.post("/login", loginController);

AuthRouter.post("/refresh", refreshController);

AuthRouter.post("/logout", refreshController);

export default AuthRouter;
