const express = require("express");
const routes = express.Router();

const userController = require("./controllers/userController");
const authController = require("./controllers/authController");

routes.post("/users", userController.store);
routes.post("/login", userController.login);
routes.post("/admin", authController.adminLogin);

module.exports = routes;
