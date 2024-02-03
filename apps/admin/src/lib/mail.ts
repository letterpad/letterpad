import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  service: "aws",
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
  host: process.env.SMTP_HOST,
  port: 465,
});

interface Props {
  from: string;
  to?: string;
  subject: string;
  html: string;
  replyTo?: string;
  bcc?: string;
}
export const mail = (
  mailOptions: Props,
  addBcc = true
): Promise<SMTPTransport.SentMessageInfo> => {
  return new Promise((resolve, reject) => {
    if (process.env.LETTERPAD_PLATFORM === "true" && addBcc) {
      mailOptions = {
        ...mailOptions,
        bcc: `"Letterpad <${process.env.SENDER_EMAIL}>`,
      };
    }
    transporter.sendMail(mailOptions, async function (err, info) {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

export const hasCredentials = () => {
  return (
    process.env.SMTP_USERNAME &&
    process.env.SMTP_PASSWORD &&
    process.env.SMTP_HOST
  );
};
