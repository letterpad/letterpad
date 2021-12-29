import models from "@/graphql/db/models";
import { EmailProps } from "@/graphql/types";
import { getDateTime } from "@/shared/utils";
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

export async function enqueueEmail(props: EmailProps) {
  const found = await models.EmailDelivery.findOne({ where: props });
  if (found) return "Record already exist";
  models.EmailDelivery.create({
    ...props,
    createdAt: getDateTime(new Date()) as any,
    delivered: false,
  } as any);
}
