import express from "express";
import AuthController from "../controllers/AuthController.js";
import ContactController from "../controllers/ContactController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import SpamController from "../controllers/SpamController.js";

const RouteConfig = express.Router();

RouteConfig.use("/", AuthController);

RouteConfig.use("/contacts", authMiddleware, ContactController);

RouteConfig.use("/spam", authMiddleware, SpamController);

export default RouteConfig;