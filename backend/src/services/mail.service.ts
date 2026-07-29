import nodemailer from "nodemailer";
import { env } from "../config/env";
import type { Email } from "../generated/prisma/client";

class MailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });

  send = async (email: Email) => {
    await this.transporter.sendMail({
      from: env.SMTP_FROM,
      to: email.recipient,
      subject: email.subject,
      text: email.body,
      html: `
      <div style="font-family: Arial, sans-serif;">
        <p>${email.body}</p>
      </div>
    `,
    });
  };

  verify = async () => {
    await this.transporter.verify();
  };
}

export const mailService = new MailService();
