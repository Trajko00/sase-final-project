import { Document, ObjectId } from "mongoose";

export interface IMemo extends Document {
  title: string;
  createdBy: ObjectId;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}
