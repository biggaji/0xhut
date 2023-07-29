import mongoose, { Schema } from "mongoose";

const authServerSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  signingkey: { type: mongoose.Types.ObjectId, ref: 'signingKey'}
}, { timestamps: true });

export const AuthServerModel = mongoose.model('authServer', authServerSchema);