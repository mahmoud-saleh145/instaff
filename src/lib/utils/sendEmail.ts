import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.emailSender, pass: process.env.emailSenderPassword },
});

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({ from: `"InStaff" <${process.env.emailSender}>`, to, subject, html });
}
