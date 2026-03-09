import dotenv from "dotenv";
dotenv.config();
import argon2 from "argon2";

const options = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16, // 64 mb
  timeCost: 5,
  parallelism: 1,
};

const pepper = process.env.PASSWORD_PEPPER || "default_pepper";

export const createHash = async (password) => {
  return await argon2.hash(password + pepper, options);
};

export const verifyHash = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password + pepper);
};
