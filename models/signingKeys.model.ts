import mongoose, { Schema } from "mongoose";

const SigningKeySchema = new Schema({
  key: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  revokedAt: Date,
  expiresAt: { type: Date },
  scope: {
    type: String,
    enum: ["server:write", "server:read", "server:read:write"],
    default: "server:read"
  },
  server: { type: mongoose.Types.ObjectId, ref: 'authServer', required: true }
}, { timestamps: true });

export const SigningKeyModel = mongoose.model('signingKey', SigningKeySchema);