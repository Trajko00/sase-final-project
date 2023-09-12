import { z } from "zod";

export const memoSchema = z.object({
  title: z.string().min(1).max(255),
  note: z.string().min(1).max(255),
});
