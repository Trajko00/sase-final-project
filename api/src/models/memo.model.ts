import mongoose from "mongoose";
import { IMemo } from "../interfaces/memo";

const options = {
  collection: "memos",
  timestamps: true,
};

const memoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    note: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  options
);

export const Memo = mongoose.model<IMemo>("Memo", memoSchema);
