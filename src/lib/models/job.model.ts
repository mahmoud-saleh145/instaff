import { Schema, models, model } from "mongoose";
import "./user.model";

const jobSchema = new Schema({
  companyId:        { type: Schema.Types.ObjectId, ref: "User", required: true },
  title:            { type: String, required: true, trim: true },
  companyName:      { type: String, required: true },
  description:      { type: String, default: "", trim: true },
  location:         { type: String, default: "" },
  salary:           { type: Number, default: 0 },
  jobType:          { type: String, enum: ["FULL_TIME", "PART_TIME", "REMOTE", "INTERNSHIP"], required: true },
  skillsRequired:   { type: [String], default: [] },
  startDate:        { type: Date, required: true },
  endDate:          { type: Date, required: true },
  status:           { type: String, enum: ["open", "in-progress", "completed", "closed"], default: "open" },
  applicantsCount:  { type: Number, default: 0 },
  positions:        { type: Number, default: 1 },
  isUnlimitedHiring:{ type: Boolean, default: false },
}, { timestamps: true });

export default models.Job || model("Job", jobSchema);
