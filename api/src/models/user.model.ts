import mongoose from "mongoose";
import { IUser } from "../interfaces/user";

const options = {
  collection: "users",
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    passwordHash: { type: String, required: true },
    created: { type: Date, default: Date.now },
    memos: { type: [mongoose.Schema.Types.ObjectId], ref: "Memo" },
  },
  options
);

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (_doc: any, ret: any) {
    delete ret.passwordHash;
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
