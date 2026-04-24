import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import meController from "../modules/me/me.controller.js";
import logoutController from "../modules/me/logout.controller.js";

const MeRouter = express.Router();

MeRouter.get("/me", authMiddleware, meController);

MeRouter.post("/logout", authMiddleware, logoutController);

export default MeRouter;
