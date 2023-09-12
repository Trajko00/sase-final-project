import { z } from "zod";

export const userRegisterSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const userLoginSchema = z.object({
  username: z.string().min(1).max(255),
  password: z.string().min(1).max(255),
});

export const changePasswordSchema = z
  .object({
    password: z.string().min(1).max(255),
    passwordRepeat: z.string().min(1).max(255),
  })
  .superRefine(({ passwordRepeat, password }, ctx) => {
    if (passwordRepeat !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });
