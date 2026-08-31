import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { env } from "../config/env";
import type { Email, Sender } from "../generated/prisma/client";
import { decrypt, isEncrypted } from "../utils/encryption";
import sanitizeHtml from "sanitize-html";

class MailService {
  private transporters = new Map<string, Transporter>();

  private getTransporter(sender: Sender): Transporter {
    const key = `${sender.id}:${sender.email}`;
    if (this.transporters.has(key)) return this.transporters.get(key)!;

    const password = isEncrypted(sender.password) ? decrypt(sender.password) : sender.password;

    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      pool: true,
      maxConnections: 3,
      maxMessages: 100,
      auth: { user: sender.email, pass: password },
    });

    this.transporters.set(key, transporter);
    return transporter;
  }

  send = async (email: Email & { sender: Sender }, recipientEmail: string) => {
    const transporter = this.getTransporter(email.sender);

    // Sanitize HTML - allow basic formatting but strip scripts
    const cleanHtml = sanitizeHtml(email.body, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "span", "div"]),
      allowedAttributes: {
        ...sanitizeHtml.defaults.allowedAttributes,
        "*": ["style", "class"],
        a: ["href", "name", "target"],
        img: ["src", "alt", "width", "height"],
      },
      allowedSchemes: ["http", "https", "mailto"],
    });

    // Plain text fallback - strip tags
    const textFallback = sanitizeHtml(email.body, { allowedTags: [], allowedAttributes: {} });

    await transporter.sendMail({
      from: email.sender.email,
      to: recipientEmail,
      subject: email.subject,
      text: textFallback,
      html: `<div style="font-family: Arial, sans-serif; line-height:1.6;">${cleanHtml}</div>`,
    });
  };

  verify = async (sender: Sender) => {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: false,
      auth: {
        user: sender.email,
        pass: isEncrypted(sender.password) ? decrypt(sender.password) : sender.password,
      },
    });
    await transporter.verify();
  };

  closeAll = async () => {
    for (const t of this.transporters.values()) t.close();
    this.transporters.clear();
  };
}

export const mailService = new MailService();
