import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export enum Subjects {
  VERIFY_EMAIL = "Verify Email",
  RESET_PASSWORD = "Reset your password",
}

interface Mail {
  to: string;
  subject: Subjects;
  html: string;
  from?: string;
}

export default async function sendMail(data: Mail) {
  try {
    const status = await sgMail.send({
      from: "letterpad@ajaxtown.com",
      ...data,
    });
    return status;
  } catch (e) {
    console.log("e :>> ", e);
  }
}
