import { NextFunction, Request, Response, Router } from "express";
import { authorize } from "../middleware/authorize";
import { getMemosByUserId, getMemoById, deleteMemo, createMemo } from "../services/memo.service";
import { IUser } from "../interfaces/user";
import { memoSchema } from "../schemas/memo";

const memoRouter = Router();

const getAllUserMemos = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  const memos = await getMemosByUserId(req.user?.id);
  res.json(memos);
};

const getSingleUserMemo = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  const memo = await getMemoById(req.body.memoId, req.user?.id);
  res.json(memo);
  next();
};

const deleteSingleUserMemo = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  await deleteMemo(req.body.memoId, req.user?.id);
  res.json({ message: "Memo deleted" });
  next();
};

const createSingleMemo = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  const { success } = await memoSchema.safeParseAsync(req.body);

  if (!success) {
    return res.status(400).json({ message: "Bad request" });
  }
  const memo = await createMemo(
    {
      title: req.body.title,
      note: req.body.note,
    },
    req.user?.id
  );
  res.json(memo);
  next();
};

memoRouter.get("/all", authorize(), getAllUserMemos);
memoRouter.get("/:id", authorize(), getSingleUserMemo);
memoRouter.delete("/:id", authorize(), deleteSingleUserMemo);
memoRouter.post("/create", authorize(), createSingleMemo);

export { memoRouter };
