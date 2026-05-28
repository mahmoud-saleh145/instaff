import { connectToDB } from "../db/db";
import Notification from "../models/notification.model";

interface CreateNotifArgs {
  userId: string;
  type: "application" | "job" | "review";
  title: string;
  message: string;
  link?: string;
}

export async function createNotification(args: CreateNotifArgs) {
  await connectToDB();
  return Notification.create(args);
}
