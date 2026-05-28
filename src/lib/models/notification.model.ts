import { Schema, models, model } from "mongoose";
import "./user.model";

const notificationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  type: {
    type: String,
    enum: ["application", "job", "review"],
    required: true,
  },
  title:   { type: String, required: true },
  message: { type: String, required: true },
  read:    { type: Boolean, default: false },
  link:    { type: String, default: "" },
}, { timestamps: true });

const Notification = models.Notification || model("Notification", notificationSchema);
export default Notification;
