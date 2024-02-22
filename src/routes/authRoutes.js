const express = require("express");
const { signupUser, loginUser } = require("../controllers/userCont");

const router = express.Router();

router.post("/signup", signupUser);     // route for signup

router.post("/login", loginUser);       // route for login

module.exports = router;