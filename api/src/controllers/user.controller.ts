import { NextFunction, Request, Response, Router } from "express";
import { changePasswordSchema, userRegisterSchema } from "../schemas/user";
import {
  authenticate,
  changeUserPassword,
  refreshUserToken,
  registerUser,
} from "../services/user.service";
import { setCookie } from "../lib/setCookie";
import { IUser } from "../interfaces/user";
import { authorize } from "../middleware/authorize";

const userRouter = Router();

const register = async (req: Request, res: Response, next: NextFunction) => {
  const { success } = await userRegisterSchema.safeParseAsync(req.body);

  if (!success) {
    return res.status(400).json({ message: "Neispravni podaci" });
  }

  try {
    const user = await registerUser(req.body.username, req.body.password);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error while creating the user." });
  }

  next();
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const ipAdress = req.ip;

  const { accessToken, refreshToken, user } = await authenticate(username, password, ipAdress);

  setCookie(res, refreshToken.token);

  res.json({ accessToken, refreshToken, user });

  next();
};

const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jid;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const ipAdress = req.ip;

  const { accessToken, refreshToken, user } = await refreshUserToken(token, ipAdress);

  setCookie(res, refreshToken.token);

  res.json({ accessToken, refreshToken, user });

  next();
};

const changePassword = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  const { password, passwordRepeat } = req.body;

  const { success } = await changePasswordSchema.safeParseAsync(req.body);

  if (!success) {
    return res.status(400).json({ message: "Neispravni podaci" });
  }

  if (password !== passwordRepeat) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    await changeUserPassword(req.user?.id, req.body.password);
    res.json({ message: "Password changed successfully" });
  } catch (e) {
    res.status(400).json({ message: "Error while changing the password." });
  }

  next();
};

const revoke = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jid;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now()),
  };

  res.cookie("jid", token, {
    ...cookieOptions,
  });
  res.json({ message: "Usposno ste se izlogovali" });

  next();
};

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/revoke", authorize, revoke);
userRouter.post("/refresh", refreshToken);
userRouter.post("/update-password", authorize, changePassword);

export { userRouter };
