import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  memos?: string[] | ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
