import models from "@/graphql/db/models";
import { EmailProps, Mail } from "@/graphql/types";
import { getDateTime } from "@/shared/utils";
import { bodyDecorator } from "./decorator";
import mailJet from "node-mailjet";
import logger from "@/shared/logger";
import * as Sentry from "@sentry/nextjs";
import { getEmailTemplate } from ".";

const client = mailJet.connect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
);

export default function SendMail(
  data: Mail,
  addUnsubscribe: boolean = false,
): any {
  if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
    return logger.debug("No email sent. Keys not found");
  }
  const recipients = ["abhisheksaha11@gmail.com"]; //typeof data.to === "string" ? [data.to] : data.to;
  const mails = recipients.map((to) => {
    const body = bodyDecorator(data.html, to, addUnsubscribe);
    // send mail
    return client
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: process.env.SENDER_EMAIL || "me@ajaxtown.com",
              Name: "Letterpad",
            },
            To: [
              {
                Email: to,
                Name: data.to,
              },
            ],
            Subject: data.subject,
            HTMLPart: body,
          },
        ],
      })
      .catch((e) => {
        Sentry.captureException(e);
        return e;
      });
  });
  return Promise.all(mails);
}

export async function enqueueEmail(props: EmailProps) {
  try {
    const found = await models.EmailDelivery.findOne({ where: props });
    if (found) {
      return logger.debug("Email record exist. Skipping");
    }
    await models.EmailDelivery.create({
      ...props,
      createdAt: getDateTime(new Date()) as any,
      delivered: false,
    } as any);

    // TODO - Since we are tracking the email, we should not run it on the main thread. Instead use a child thread or an external service. Lets worry when we are worried.
    if (!process.env.MJ_APIKEY_PUBLIC || !process.env.MJ_APIKEY_PRIVATE) {
      return logger.debug("No email sent. Keys not found");
    }
    const data = await getEmailTemplate(props);
    if (data.ok) {
      const response = await SendMail(data.content);

      if (response && response.length > 0) {
        if (response[0].response.res.statusCode === 200) {
          // update delivery
          await models.EmailDelivery.update(
            { delivered: true },
            { where: props },
          );
        }
      }
    } else {
      console.log(data);
      Sentry.captureException(new Error(data.message));
    }
  } catch (e) {
    Sentry.captureException(e);
  }
}
