import { NextFunction, Response, Request } from "express";
import { expressjwt } from "express-jwt";
import { User } from "../models/user.model";
import dotenv from "dotenv";
import { IUser } from "../interfaces/user";
const jwksClient = require("jwks-rsa");
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";

dotenv.config();

export function authorize() {
  dotenv.config();

  return [
    // same as manually splitting bearer token from header and validating
    // but with more strict checks and less code
    //@ts-ignore
    expressjwt({
      // secret: jwksClient({
      //   jwksUri: "localhost:3000/.well-known/jwks.json",
      // }),
      secret: fs.readFileSync(path.join(__dirname, "../../keys/public.pem")).toString(),
      algorithms: ["RS256"],
    }),

    async (req: Request & { auth?: IUser }, res: Response, next: NextFunction) => {
      // user attached to request by jwt middleware, not the real one, just what is serialized in jwt
      if (!req.auth) return res.status(401).json({ message: "Unauthorized" });

      if (!req.auth.id) return res.status(401).json({ message: "Unauthorized" });

      const user = await User.findById(req.auth.id);
      if (!user) return res.status(401).json({ message: "Unauthorized" });
      //@ts-ignore
      req.user = req.auth;

      next();
    },
  ];
}
