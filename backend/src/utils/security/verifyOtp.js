import expressAsyncHandler from "express-async-handler";
import { hashedOtp } from "./otp.js";
import { genRefreshToken, genAccessToken } from "../token/genToken.js";

const verifyOtp = (Model, role) =>
  expressAsyncHandler(async (req, res) => {
    const { otp, email } = req.body;

    if (!otp || !email) {
      res.status(400);
      throw new Error("OTP and email are required");
    }

    // OTP should be exactly six digits
    if (!/^[0-9]{6}$/.test(otp)) {
      res.status(400);
      throw new Error("OTP must be a 6-digit number");
    }

    const user = await Model.findOne({ email });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    if (user.role !== role) {
      res.status(403);
      throw new Error("Unauthorized role");
    }

    const hashedOtpValue = hashedOtp(otp);

    // OTP should not be expired
    if (!user.otpExpires || user.otpExpires < Date.now()) {
      res.status(400);
      throw new Error("OTP has expired");
    }

    const accessToken = genAccessToken(user._id);
    const refreshToken = genRefreshToken(user._id);

    user.refreshToken = refreshToken;
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 10 * 60 * 1000, // match JWT expiry (10 minutes)
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(200)
      .json({ success: true, message: "Account verified successfully" });
  });

export default verifyOtp;
