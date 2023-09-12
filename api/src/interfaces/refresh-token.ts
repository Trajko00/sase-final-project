import { Document, Schema } from "mongoose";

interface IRefreshToken extends Document {
  user: Schema.Types.ObjectId;
  token: string;
  expires: Date;
  created: Date;
  createdByIp: string;
  revoked: Date;
  revokedByIp: string;
  replacedByToken: string;
  isActive?: () => boolean;
  isExpired?: () => boolean;
}
export { IRefreshToken };
