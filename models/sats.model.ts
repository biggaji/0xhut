import mongoose, { Schema } from "mongoose";

const sharedAccessTokenSchema = new Schema({
  issuingServer: { type: mongoose.Types.ObjectId, ref: 'authServer', required: true },
  issuedToUser: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  token: { type: String, required: true },
  revoked: { type: Boolean, default: false },
  revokedAt: Date,
}, { timestamps: true });

export const SatModel = mongoose.model('sharedAccessToken', sharedAccessTokenSchema);