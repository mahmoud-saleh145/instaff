import { Schema, models, model } from "mongoose";

const userSchema = new Schema<IUser>({
  firstName:    { type: String, required: true, trim: true },
  lastName:     { type: String, required: true, trim: true },
  email:        { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:     { type: String, required: true },
  phone:        { type: Number },
  role:         { type: String, enum: ["EMPLOYEE", "COMPANY", "ADMIN"], default: "EMPLOYEE" },
  rating:       { type: Number, default: 0 },
  ratingCount:  { type: Number, default: 0 },
  skills:       { type: [String], default: [] },
  companyName:  { type: String },
  refreshToken: { type: String },
}, { timestamps: true });

export default models.User || model<IUser>("User", userSchema);
