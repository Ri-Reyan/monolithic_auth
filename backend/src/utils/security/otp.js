import crypto from "crypto";

export const genOtp = () => {
  const digit = Math.floor(100000 + Math.random() * 900000).toString();

  return digit;
};

export const hashedOtp = (otp) => {
  return crypto.createHash("sha256").update(otp).digest("hex");
};
