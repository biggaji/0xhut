import mongoose, { Schema } from "mongoose";

const SigningKeySchema = new Schema({
  key: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  revokedAt: Date,
  scope: {
    type: String,
    default: "server:read"
  }
}, { timestamps: true });

export const SigningKeyModel = mongoose.model('signingKey', SigningKeySchema);