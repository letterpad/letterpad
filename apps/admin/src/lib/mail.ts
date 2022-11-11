import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

interface Props {
  from: string; // sender address
  to: string; // list of receivers
  subject: string; // Subject line
  html: string; // plain text body
  replyTo?: string;
  bcc?: string;
}
export const mail = (
  mailOptions: Props,
): Promise<SMTPTransport.SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    if (process.env.LETTERPAD_PLATFORM === "true") {
      mailOptions = {
        ...mailOptions,
        bcc: `"Letterpad <${process.env.GMAIL_USER}>`,
      };
    }
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

export const hasCredentials = () => {
  return process.env.GMAIL_USER && process.env.GMAIL_PASSWORD;
};
