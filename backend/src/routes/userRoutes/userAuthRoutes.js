import express from "express";
import Registration from "../../controllers/usercontrollers/Registration.controller.js";
import verifyOtp from "../../utils/security/verifyOtp.js";
import User from "../../models/userSchema/user.model.js";
import Login from "../../controllers/usercontrollers/Login.controller.js";
import logout from "../../controllers/usercontrollers/Logout.controllers.js";
import refreshToken from "../../controllers/authentication/refresh.contollers.js";
const router = express.Router();

router.post("/register", Registration(User));
router.post("/login", Login(User));
router.post("/logout", logout(User));
router.post("/refresh-token", refreshToken(User));

router.post("/verify-otp", verifyOtp(User, "student"));

export default router;
