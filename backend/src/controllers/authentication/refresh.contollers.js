import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { genAccessToken, genRefreshToken } from "../../utils/token/genToken.js";

const refreshToken = (Model) =>
  asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
      res.status(401);
      throw new Error("Refresh token missing");
    }

    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }

    const user = await Model.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      res.status(403);
      throw new Error("Refresh token mismatch");
    }

    const newAccessToken = genAccessToken(user._id);
    const newRefreshToken = genRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Access token refreshed",
    });
  });

export default refreshToken;
