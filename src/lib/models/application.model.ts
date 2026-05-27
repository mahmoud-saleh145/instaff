import { Schema, models, model } from "mongoose";
import "./user.model";
import "./job.model";

const applicationSchema = new Schema({
  jobId:      { type: Schema.Types.ObjectId, ref: "Job", required: true },
  employeeId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  status:     { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  note:       { type: String, default: "" },
  appliedAt:  { type: Date, default: Date.now },
}, { timestamps: true });

export default models.Application || model("Application", applicationSchema);
