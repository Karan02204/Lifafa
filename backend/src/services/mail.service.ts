import nodemailer from "nodemailer";
import { env } from "../config/env";
import type { Email, Sender } from "../generated/prisma/client";

class MailService {
  send = async (email: Email & { sender: Sender }, recipientEmail: string) => {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: email.sender.email,
        pass: email.sender.password,
      },
    });

    await transporter.sendMail({
      from: email.sender.email,
      to: recipientEmail,
      subject: email.subject,
      text: email.body,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <p>${email.body}</p>
        </div>
      `,
    });
  };

  verify = async (sender: Sender) => {
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: sender.email,
        pass: sender.password,
      },
    });

    await transporter.verify();
  };
}

export const mailService = new MailService();
