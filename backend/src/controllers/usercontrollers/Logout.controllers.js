import asyncHandler from "express-async-handler";

const logout = (Model) =>
  asyncHandler(async (req, res) => {
    const token = req.cookies.refreshToken;

    if (token) {
      const user = await Model.findOne({ refreshToken: token });

      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  });

export default logout;
