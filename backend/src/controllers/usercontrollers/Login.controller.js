import asyncHandler from "express-async-handler";
import User from "../../models/userSchema/user.model.js";
import { LoginSchema } from "../../validations/auth/auth.validator.js";
import { verifyHash } from "../../utils/security/argon.js";
import { genAccessToken, genRefreshToken } from "../../utils/token/genToken.js";

const Login = (Model) =>
  asyncHandler(async (req, res) => {
    const { success, data, error } = LoginSchema.safeParse(req.body);

    if (!success) {
      const errorMessage = error?.errors[0]?.message || "Invalid login data";
      res.status(400);
      throw new Error(errorMessage);
    }
    const { email, password } = data;

    const existingUser = await Model.findOne({ email });

    if (!existingUser) {
      res.status(400);
      throw new Error("Invalid email or password");
    }

    const isVerified = existingUser.isVerified;

    if (!isVerified) {
      res.status(403);
      throw new Error("Please verify your email before logging in");
    }

    const isPasswordValid = await verifyHash(existingUser.password, password);

    if (!isPasswordValid) {
      res.status(400);
      throw new Error("Invalid email or password");
    }

    const accessToken = genAccessToken(existingUser._id);
    const refreshToken = genRefreshToken(existingUser._id);

    existingUser.refreshToken = refreshToken;
    await existingUser.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      userInfo: {
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    });
  });

export default Login;
