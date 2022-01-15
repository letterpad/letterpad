import models from "@/graphql/db/models";
import {
  EmailProps,
  EmailTemplateMeta,
  EmailTemplates,
  Mail,
} from "@/graphql/types";
import { getDateTime } from "@/shared/utils";
import { bodyDecorator } from "./decorator";
import mailJet from "node-mailjet";
import logger from "@/shared/logger";
import * as Sentry from "@sentry/nextjs";
import { getEmailTemplate } from ".";

let client: mailJet.Email.Client;

if (process.env.MJ_APIKEY_PUBLIC && process.env.MJ_APIKEY_PRIVATE) {
  client = mailJet.connect(
    process.env.MJ_APIKEY_PUBLIC,
    process.env.MJ_APIKEY_PRIVATE,
  );
}

export default function SendMail(
  data: Mail,
  meta: EmailTemplateMeta,
  addUnsubscribe: boolean = false,
): any {
  if (!client) {
    return logger.debug("No client found to send emails");
  }
  const recipients = typeof data.to === "string" ? [data.to] : data.to;
  const mails = recipients.map((to) => {
    const body = bodyDecorator(data.html, to, addUnsubscribe);
    // send mail
    return client
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              // the or clause is to overwrite this setting for demo purpose
              Email: process.env.SENDER_EMAIL || meta.setting.site_email,
              Name: meta.setting.site_title || "Letterpad",
            },
            To: [
              {
                Email: to,
                Name: to,
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
  if (!client) {
    return logger.debug(
      "No client found to send emails. Terminating enqueuing Email",
    );
  }
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
    const data = await getEmailTemplate(props);

    if (data.ok) {
      const addUnsubscribe = props.template_id === EmailTemplates.NEW_POST;
      const response = await SendMail(data.content, data.meta, addUnsubscribe);
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
