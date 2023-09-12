import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "../controllers/user.controller";
import { memoRouter } from "../controllers/memo.controller";
import { errorHandler } from "../middleware/error-handler";
import cookieParser from "cookie-parser";

dotenv.config();
export const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: (_origin, callback) => callback(null, true),
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  //   app.use(cookieParser());

  //app.use("/leaflets", leafletRouter);
  app.use("/user", userRouter);
  app.use("/memo", memoRouter);
  app.get("/bing", async (req: Request, res: Response, next: NextFunction) => {
    res.json({
      message: "bong",
      version: 1.0,
    });
  });

  app.use(errorHandler);
  return app;
};
