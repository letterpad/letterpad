import sgMail from "@sendgrid/mail";
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export enum Subjects {
  VERIFY_EMAIL = "Verify Email",
  FORGOT_PASSWORD = "Forgot Password ?",
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
