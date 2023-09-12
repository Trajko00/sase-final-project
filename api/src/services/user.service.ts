import { User } from "../models/user.model";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { RefreshToken } from "../models/refresh-token.model";
import fs from "fs";
import path from "path";

export const registerUser = async (username: string, password: string) => {
  return await User.create({ username, passwordHash: await hashPassword(password) });
};

export const getUserByUsername = async (username: string) => {
  return await User.findOne({ username });
};

export const getUserById = async (id: string) => {
  return await User.findById(id);
};

export const changeUserPassword = async (password: string, userId: string) => {
  const user = await getUserById(userId);

  if (!user) throw "User not found";

  user.passwordHash = await hashPassword(password);

  await user.save();
};

const hashPassword = async (password: string) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
  });
};

const randomTokenString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const generateAccessToken = (user: any) => {
  const keyPath = path.join(__dirname, "../../keys/private.pem");
  const privateKey = fs.readFileSync(keyPath, "utf8");
  return jwt.sign({ sub: user.id, id: user.id }, privateKey, {
    expiresIn: "15m",
    algorithm: "RS256",
  });
};

const generateRefreshToken = (user: any, ipAdress: string) => {
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdByIp: ipAdress,
  });
};

const getRefreshToken = async (token: string) => {
  const refreshToken = await RefreshToken.findOne({ token });
  if (!refreshToken) throw "no token";
  if (!refreshToken || !refreshToken.isActive) throw "Invalid token";

  const user = await User.findById(refreshToken.user);

  if (!user) throw "Account not fonud";

  return { refreshToken, user };
};

export const refreshUserToken = async (token: string, ipAdress: string) => {
  const { refreshToken, user } = await getRefreshToken(token);

  const newRefreshToken = generateRefreshToken(user, ipAdress);

  refreshToken.revoked = new Date(Date.now());
  refreshToken.revokedByIp = ipAdress;
  refreshToken.replacedByToken = newRefreshToken.token;

  await refreshToken.save();
  await newRefreshToken.save();

  const accessToken = generateAccessToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  };
};

export const authenticate = async (username: string, password: string, ipAdress: string) => {
  const user = await User.findOne({ username });

  if (!user || !(await argon2.verify(user.passwordHash, password))) {
    throw new Error("Neispravan email ili lozinka");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user, ipAdress);

  await refreshToken.save();

  return {
    accessToken,
    refreshToken,
    user,
  };
};
