import SMTPTransport from "nodemailer/lib/smtp-transport";

interface Props {
  from: string; // sender address
  to: string; // list of receivers
  subject: string; // Subject line
  html: string; // plain text body
  replyTo?: string;
  bcc?: string;
}
export const mail = async (
  mailOptions: Props,
  addBcc = true
): Promise<SMTPTransport.SentMessageInfo> => {
  if (process.env.LETTERPAD_PLATFORM === "true" && addBcc) {
    mailOptions = {
      ...mailOptions,
      bcc: `"Letterpad <${process.env.GMAIL_USER}>`,
    };
  }

  const req = await fetch(process.env.ROOT_URL + "/api/mailer", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailOptions),
  });
  return await req.json();
};

export const hasCredentials = () => {
  return process.env.GMAIL_USER && process.env.GMAIL_PASSWORD;
};
