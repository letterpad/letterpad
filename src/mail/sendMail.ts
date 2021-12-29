import Twig from "twig";
import fs from "fs";
import path from "path";
import { getToken } from "@/shared/token";
import sgMail from "@sendgrid/mail";
import { bodyDecorator } from "./decorator";

if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

interface Mail {
  to: string | string[];
  subject: string;
  html: string;
}

export default function SendMail(data: Mail, addUnsubscribe: boolean = false) {
  const to = typeof data.to === "string" ? [data.to] : data.to;
  return to.map((to) => {
    const body = bodyDecorator(data.html, to, addUnsubscribe);

    // send mail
    // sgMail.send({
    //   ...data,
    //   html: body,
    //   from: "admin@letterpad.app",
    // });

    return body;
  });
}
