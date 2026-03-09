import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (email, otp, Model) => {
  try {
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }

    const mailOptions = {
      from: `Aspirex ${process.env.EMAIL_USER}`,
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      to: email,
      subject: "Your OTP for Account Verification",
      html: `<p>Dear User,</p>
             <p>Your OTP for account verification is: <strong>${otp}</strong></p>
             <p>This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
             <p>Best regards,<br/>AspireX Team</p>`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email:", error);
    await Model.deleteOne({ email });
    throw new Error("Registration failed. Please try again later.");
  }
};

export default sendEmail;
