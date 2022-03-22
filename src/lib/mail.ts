import nodemailer from "nodemailer";

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
}
export const mail = (mailOptions: Props) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

export const hasCredentials = () => {
  return process.env.GMAIL_USER && process.env.GMAIL_PASSWORD;
};
