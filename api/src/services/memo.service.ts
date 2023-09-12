import { Memo } from "../models/memo.model";

export const getMemoById = async (id: string, userId: string) => {
  const memo = await Memo.findOne({ _id: id, createdBy: userId });
  if (!memo) throw "Memo not found";

  return memo;
};

export const getMemosByUserId = async (userId: string) => {
  const memos = await Memo.find({ createdBy: userId });
  return memos;
};

export const createMemo = async (memo: any, userId: string) => {
  return await Memo.create({ ...memo, createdBy: userId });
};

export const updateMemo = async (memo: any) => {
  const memoToUpdate = await getMemoById(memo._id, memo.createdBy);
  if (!memoToUpdate) throw "Memo not found";

  Object.assign(memoToUpdate, memo);

  await memoToUpdate.save();

  return memoToUpdate;
};

export const deleteMemo = async (id: string, userId: string) => {
  const memo = await getMemoById(id, userId);

  if (!memo) throw "Memo not found";

  await memo.deleteOne({ _id: id });
};
