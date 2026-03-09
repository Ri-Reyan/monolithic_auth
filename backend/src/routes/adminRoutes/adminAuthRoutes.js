import express from "express";
import Registration from "../../controllers/usercontrollers/Registration.controller.js";
import verifyOtp from "../../utils/security/verifyOtp.js";
import Admin from "../../models/adminSchema/admin.model.js";
import Login from "../../controllers/usercontrollers/Login.controller.js";
import logout from "../../controllers/usercontrollers/Logout.controllers.js";
import refreshToken from "../../controllers/authentication/refresh.contollers.js";

const router = express.Router();

router.post("/register", Registration(Admin));
router.post("/login", Login(Admin));
router.post("/logout", logout(Admin));
router.post("/refresh-token", refreshToken(Admin));

router.post("/verify-otp", verifyOtp(Admin, "admin"));

export default router;
