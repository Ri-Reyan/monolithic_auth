import User from "../../models/userSchema/user.model.js";
import asyncHandler from "express-async-handler";
import { createHash } from "../../utils/security/argon.js";
import { RegisterSchema } from "../../validations/auth/auth.validator.js";
import { genOtp } from "../../utils/security/otp.js";
import { hashedOtp } from "../../utils/security/otp.js";
import sendEmail from "../../services/mail/sendEmail.js";

const Registration = (Model) =>
  asyncHandler(async (req, res) => {
    const { success, data, error } = RegisterSchema.safeParse(req.body);

    if (!success) {
      const errorMessage =
        error?.errors[0]?.message || "Invalid registration data";

      return res.status(400).json({ success: false, message: errorMessage });
    }

    const { name, email, password } = data;

    const userExists = await Model.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await createHash(password);

    const otp = genOtp();
    const hashedOtpValue = hashedOtp(otp);

    const newUser = await Model.create({
      name,
      email,
      password: hashedPassword,
      otp: hashedOtpValue,
      otpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
    });

    await sendEmail(email, otp, Model);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      userInfo: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  });

export default Registration;
