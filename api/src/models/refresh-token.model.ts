import mongoose from "mongoose";
import { IRefreshToken } from "../interfaces/refresh-token";

const refreshTokenSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: String,
  expires: Date,
  created: { type: Date, default: Date.now },
  createdByIp: String,
  revoked: Date,
  revokedByIp: String,
  replacedByToken: String,
});

refreshTokenSchema.virtual("isExpired").get(function () {
  //@ts-ignore
  return Date.now() >= this.expires;
});

refreshTokenSchema.virtual("isActive").get(function () {
  if (typeof this.revokedByIp === "string") return false;
  else {
    return true;
  }
});

const RefreshToken = mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export { RefreshToken };
