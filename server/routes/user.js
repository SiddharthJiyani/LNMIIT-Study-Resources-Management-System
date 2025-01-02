const express = require("express");
const { signup, login, sendotp, forgotPassword, logout, resetPassword } = require("../controllers/Auth");
const router = express.Router();

router.post("/signup" , signup);
router.post("/login" , login);
router.get("/logout", logout);
router.post("/sendotp",sendotp);
router.post("/forgotpassword",forgotPassword);
router.post("/resetpassword",resetPassword);


module.exports = router;