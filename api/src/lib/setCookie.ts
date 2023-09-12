import { Response } from "express";

export const setCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    // ...(env === "production" && { domain: "beem.rs" }),
    // ...(env === "production" && { secure: true }),
    secure: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res.cookie("jid", token, {
    ...cookieOptions,
  });
};
