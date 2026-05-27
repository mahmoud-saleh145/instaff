import { Schema, models, model } from "mongoose";
import "./user.model";
import "./job.model";

const reviewSchema = new Schema({
  fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  toUserId:   { type: Schema.Types.ObjectId, ref: "User", required: true },
  jobId:      { type: Schema.Types.ObjectId, ref: "Job", required: true },
  rating:     { type: Number, min: 1, max: 5, required: true },
  comment:    { type: String, default: "" },
}, { timestamps: true });

export default models.Review || model("Review", reviewSchema);
