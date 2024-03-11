import express from "express";
import UserController from "../controllers/UserController.js";

const RouteConfig = express.Router();

RouteConfig.use("/", UserController);

export default RouteConfig;