const express = require("express");
const router = express.Router();
const { createAndUpdateUser, login, logout } = require("../Controllers/userController");

router.post("/users", createAndUpdateUser);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
